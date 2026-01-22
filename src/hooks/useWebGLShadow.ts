import { useEffect, useRef, RefObject } from 'react'

interface WebGLControls {
  leakIntensity?: number
  leakOpacity?: number
  leakLength?: number
  leakWideReach?: number
  verticalShift?: number
  auraIntensity?: number
  godRayIntensity?: number
}

interface UseWebGLShadowProps {
  isOpen: boolean
  modalRef: RefObject<HTMLDivElement>
  canvasRef: RefObject<HTMLCanvasElement>
  overlayRef: RefObject<HTMLDivElement>
  controls?: WebGLControls
}

export function useWebGLShadow({ isOpen, modalRef, canvasRef, overlayRef, controls = {} }: UseWebGLShadowProps): void {
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const positionBufferRef = useRef<WebGLBuffer | null>(null)
  const renderRef = useRef<(() => void) | null>(null)
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let gl: WebGLRenderingContext | null = null
    try {
      gl = canvas.getContext('webgl', { 
        alpha: true, 
        premultipliedAlpha: false,
        antialias: false 
      }) || canvas.getContext('experimental-webgl', { 
        alpha: true, 
        premultipliedAlpha: false 
      }) as WebGLRenderingContext | null
    } catch (e) {
      console.error('WebGL Shadow: Failed to get context', e)
      return
    }
    
    if (!gl) return
    glRef.current = gl

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_uv = (a_position + 1.0) * 0.5;
        v_uv.y = 1.0 - v_uv.y;
      }
    `

    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform vec2 u_modalSize;
      uniform vec2 u_modalPos;
      uniform vec2 u_mouse;
      uniform float u_devicePixelRatio;
      uniform float u_time;

      // Designer Controls
      uniform float u_leakIntensity;
      uniform float u_leakOpacity;
      uniform float u_leakLength;
      uniform float u_leakWideReach;
      uniform float u_verticalShift;
      uniform float u_auraIntensity;
      uniform float u_godRayIntensity;

      float roundedBoxSDF(vec2 p, vec2 center, vec2 halfSize, float radius) {
        vec2 d = abs(p - center) - halfSize + vec2(radius);
        return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
      }

      vec3 getPrismaticColor(float t) {
        vec3 green  = vec3(100.0, 210.0, 160.0) / 255.0;
        vec3 yellow = vec3(255.0, 245.0, 110.0) / 255.0; 
        // More vibrant red to ensure it pops at lower intensities
        vec3 red    = vec3(255.0, 70.0, 70.0) / 255.0;

        if (t < 0.5) return mix(green, yellow, smoothstep(0.0, 0.5, t));
        return mix(yellow, red, smoothstep(0.5, 1.0, t));
      }

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float dither(vec2 uv) {
        return fract(52.9829189 * fract(dot(uv, vec2(0.06711056, 0.00583715))));
      }

      void main() {
        vec2 pixelPos = v_uv * u_resolution;
        if (u_modalSize.x <= 0.0) {
          gl_FragColor = vec4(0.0);
          return;
        }

        vec2 modalCenter = u_modalPos + u_modalSize * 0.5;
        vec2 p = pixelPos - modalCenter;
        float modalDist = roundedBoxSDF(pixelPos, modalCenter, u_modalSize * 0.5, 16.0 * u_devicePixelRatio);

        // --- Layer 1: Subtle Aura ---
        float auraCore = exp(-max(0.0, modalDist) / (25.0 * u_devicePixelRatio));
        float auraWide = exp(-max(0.0, modalDist) / (100.0 * u_devicePixelRatio)) * 0.4;
        float aura = (auraCore + auraWide) * u_auraIntensity;
        vec3 auraColor = vec3(120.0, 160.0, 200.0) / 255.0;

        // --- Layer 2: Prismatic Bottom Leak ---
        float bottomEdge = u_modalSize.y * 0.5;
        float relativeY = p.y - (bottomEdge - u_verticalShift * u_devicePixelRatio); 

        float bottomMask = smoothstep(-15.0 * u_devicePixelRatio, 10.0 * u_devicePixelRatio, relativeY);
        // Horizontal mask: relaxed slightly to match or exceed modal width
        float horizontalMask = smoothstep(u_modalSize.x * 0.58, u_modalSize.x * 0.48, abs(p.x));
        
        float leakCore = exp(-max(0.0, relativeY) / (80.0 * u_devicePixelRatio));
        float leakWide = exp(-max(0.0, relativeY) / (u_leakWideReach * u_devicePixelRatio)) * 0.5;
        float leakFalloff = leakCore + leakWide;
        
        // --- God Rays (Streaks that cut through everything) ---
        // Subtle mouse tracking for the rays' origin
        vec2 rayOrigin = modalCenter + (u_mouse - 0.5) * 30.0 * u_devicePixelRatio;
        vec2 toRay = pixelPos - rayOrigin;
        float rayAngle = atan(toRay.y, toRay.x);

        float rays = 0.0;
        // High-frequency noise streaks based on rayAngle
        rays += pow(noise(vec2(rayAngle * 8.0, 0.0)), 4.0) * 0.6;
        rays += pow(noise(vec2(rayAngle * 16.0, u_time * 0.02)), 5.0) * 0.4;
        
        // Apply intensity control
        float rayMultiplier = mix(1.0, 1.0 + rays * 4.0, u_godRayIntensity);
        
        // Spectrum mapping (Green -> Yellow -> Red)
        // Adding back the diffused jitter for extra softness
        float diffusedY = relativeY + (noise(pixelPos * 0.02 + u_time * 0.05) - 0.5) * 10.0 * u_devicePixelRatio;
        float spectrumT = clamp(diffusedY / (u_leakLength * u_devicePixelRatio), 0.0, 1.0);
        vec3 leakColor = getPrismaticColor(spectrumT);
        
        // Combine the two layers
        // Both layers now benefit from the God Ray streaks
        vec3 finalColor = (auraColor * aura * 0.5 * rayMultiplier); 
        finalColor += (leakColor * leakFalloff * bottomMask * horizontalMask * u_leakIntensity * rayMultiplier); 

        // Apply God Ray influence to the alpha as well for more "depth" in the streaks
        float finalAlpha = max(aura * mix(1.0, 1.2, rays * u_godRayIntensity), 
                               leakFalloff * bottomMask * horizontalMask * u_leakOpacity * rayMultiplier);
        finalAlpha = max(finalAlpha, (1.0 - smoothstep(0.0, 1.0, modalDist / 8.0)) * 0.85);

        if (modalDist < 0.0) {
          finalColor *= 0.0;
          finalAlpha = 0.0;
        }

        float d = dither(pixelPos);
        finalColor += (d - 0.5) / 255.0;

        gl_FragColor = vec4(finalColor, finalAlpha);
      }
    `

    function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
      const program = gl.createProgram()
      if (!program) return null
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
      }
      return program
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vs || !fs) return
    const program = createProgram(gl, vs, fs)
    if (!program) return
    programRef.current = program

    const positionBuffer = gl.createBuffer()
    if (!positionBuffer) return
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    positionBufferRef.current = positionBuffer

    function resizeCanvas(): void {
      const width = window.innerWidth
      const height = window.innerHeight
      if (canvas.width !== width * window.devicePixelRatio ||
          canvas.height !== height * window.devicePixelRatio) {
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
    }

    function render(): void {
      if (!isOpen || !overlayRef?.current || !modalRef?.current) {
        if (canvas) canvas.style.opacity = '0'
        return
      }
      if (!modalRef.current || !canvas) return
      resizeCanvas()
      canvas.style.opacity = '1'
      const gl = glRef.current
      const program = programRef.current
      if (!gl || !program) return
      gl.useProgram(program)
      
      const posLoc = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(posLoc)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
      
      const resLoc = gl.getUniformLocation(program, 'u_resolution')
      const sizeLoc = gl.getUniformLocation(program, 'u_modalSize')
      const posLocU = gl.getUniformLocation(program, 'u_modalPos')
      const mouseLoc = gl.getUniformLocation(program, 'u_mouse')
      const dprLoc = gl.getUniformLocation(program, 'u_devicePixelRatio')
      const timeLoc = gl.getUniformLocation(program, 'u_time')

      // Controls
      const intensityLoc = gl.getUniformLocation(program, 'u_leakIntensity')
      const opacityLoc = gl.getUniformLocation(program, 'u_leakOpacity')
      const lengthLoc = gl.getUniformLocation(program, 'u_leakLength')
      const wideLoc = gl.getUniformLocation(program, 'u_leakWideReach')
      const shiftLoc = gl.getUniformLocation(program, 'u_verticalShift')
      const auraLoc = gl.getUniformLocation(program, 'u_auraIntensity')
      const godRayLoc = gl.getUniformLocation(program, 'u_godRayIntensity')

      const rect = modalRef.current.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()
      const modalPosX = (rect.left - canvasRect.left) * window.devicePixelRatio
      const modalPosY = (rect.top - canvasRect.top) * window.devicePixelRatio
      const modalWidth = rect.width * window.devicePixelRatio
      const modalHeight = rect.height * window.devicePixelRatio
      
      if (resLoc) gl.uniform2f(resLoc, canvas.width, canvas.height)
      if (sizeLoc) gl.uniform2f(sizeLoc, modalWidth, modalHeight)
      if (posLocU) gl.uniform2f(posLocU, modalPosX, modalPosY)
      if (mouseLoc) gl.uniform2f(mouseLoc, mousePosRef.current.x, mousePosRef.current.y)
      if (dprLoc) gl.uniform1f(dprLoc, window.devicePixelRatio || 1.0)
      if (timeLoc) gl.uniform1f(timeLoc, (Date.now() % 100000) / 1000.0)

      // Apply controls
      if (intensityLoc) gl.uniform1f(intensityLoc, controls.leakIntensity ?? 0.5)
      if (opacityLoc) gl.uniform1f(opacityLoc, controls.leakOpacity ?? 0.5)
      if (lengthLoc) gl.uniform1f(lengthLoc, controls.leakLength ?? 160.0)
      if (wideLoc) gl.uniform1f(wideLoc, controls.leakWideReach ?? 200.0)
      if (shiftLoc) gl.uniform1f(shiftLoc, controls.verticalShift ?? 10.0)
      if (auraLoc) gl.uniform1f(auraLoc, controls.auraIntensity ?? 0.45)
      if (godRayLoc) gl.uniform1f(godRayLoc, controls.godRayIntensity ?? 0.0)

      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    renderRef.current = render
    canvas.style.opacity = '0'
    resizeCanvas()

    if (isOpen && modalRef.current && overlayRef.current) {
      setTimeout(() => {
        resizeCanvas()
        render()
      }, 100)
    }

    const handleResize = () => {
      setTimeout(render, 100)
    }
    window.addEventListener('resize', handleResize)
    const observer = new MutationObserver(() => {
      setTimeout(render, 100)
    })
    if (modalRef.current) {
      observer.observe(modalRef.current, { attributes: true, attributeFilter: ['style'] })
    }
    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [canvasRef, modalRef, overlayRef, isOpen, controls])

  useEffect(() => {
    if (isOpen && renderRef.current && modalRef?.current && overlayRef?.current) {
      const timeout = setTimeout(() => {
        if (renderRef.current) renderRef.current()
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [isOpen, modalRef, overlayRef])

  useEffect(() => {
    if (!isOpen || !renderRef.current) return
    let animationFrameId: number | undefined
    let isRunning = true
    function animate(): void {
      if (!isRunning) return
      if (renderRef.current && overlayRef?.current && modalRef?.current && canvasRef?.current) {
        try {
          renderRef.current()
        } catch (e) {
          // Silent fail
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    const timeout = setTimeout(() => {
      if (isRunning) animationFrameId = requestAnimationFrame(animate)
    }, 50)
    return () => {
      isRunning = false
      clearTimeout(timeout)
      if (animationFrameId !== undefined) cancelAnimationFrame(animationFrameId)
    }
  }, [isOpen, overlayRef, modalRef, canvasRef])
}
