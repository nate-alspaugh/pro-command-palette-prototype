import { useEffect, useRef } from 'react'

export function useWebGLShadow({ isOpen, modalRef, canvasRef, overlayRef }) {
  const glRef = useRef(null)
  const programRef = useRef(null)
  const positionBufferRef = useRef(null)
  const renderRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.warn('WebGL Shadow: Canvas ref not available')
      return
    }

    // Ensure canvas has proper attributes for WebGL
    if (!canvas.getAttribute('width') || !canvas.getAttribute('height')) {
      canvas.width = 1
      canvas.height = 1
    }

    const gl = canvas.getContext('webgl', { 
      alpha: true, 
      premultipliedAlpha: false,
      antialias: false 
    }) || canvas.getContext('experimental-webgl', { 
      alpha: true, 
      premultipliedAlpha: false 
    })
    
    if (!gl) {
      console.error('WebGL Shadow: WebGL not supported or context creation failed')
      return
    }

    console.log('WebGL Shadow: Context created successfully')
    glRef.current = gl

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_uv = (a_position + 1.0) * 0.5;
        v_uv.y = 1.0 - v_uv.y;
      }
    `

    // Fragment shader source
    const fragmentShaderSource = `
      precision mediump float;
      
      varying vec2 v_uv;
      
      uniform vec2 u_resolution;
      uniform vec2 u_modalSize;
      uniform vec2 u_modalPos;
      uniform float u_devicePixelRatio;
      uniform float u_time;
      
      float gaussian(float dist, float sigma) {
        if (sigma <= 0.0) return 0.0;
        return exp(-(dist * dist) / (2.0 * sigma * sigma));
      }
      
      float smoothFalloff(float dist, float blurRadius) {
        // Convert blur radius to sigma (standard deviation)
        // For CSS box-shadow, sigma is typically blurRadius / 2
        // We scale by device pixel ratio first, then convert to sigma
        float scaledBlur = blurRadius * u_devicePixelRatio;
        float sigma = scaledBlur / 1.2; // Much stronger blur for smoother falloff
        
        // Ensure minimum sigma for visible blur (minimum 30 pixels for much better blur)
        sigma = max(sigma, 30.0);
        
        // Use a softer falloff curve
        float g = gaussian(dist, sigma);
        
        // Apply additional softening for better blend
        return g;
      }
      
      // Simple noise function for fog effect
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      // Fog-like turbulence for organic movement
      float fogTurbulence(vec2 p, float time) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 3; i++) {
          value += amplitude * (sin(p.x * frequency + time) * cos(p.y * frequency * 1.3 + time * 0.7));
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        
        return value * 0.5 + 0.5;
      }
      
      vec4 shadowLayer(vec2 offset, float blurRadius, vec3 color, float alpha) {
        vec2 pixelPos = v_uv * u_resolution;
        vec2 scaledOffset = offset * u_devicePixelRatio;
        
        float modalLeft = u_modalPos.x;
        float modalRight = u_modalPos.x + u_modalSize.x;
        float modalBottom = u_modalPos.y + u_modalSize.y;
        
        // Apply horizontal offset - shadows shift left by offset.x
        float offsetX = pixelPos.x - scaledOffset.x;
        
        // Calculate distance from modal bottom edge (with vertical offset)
        float distY = pixelPos.y - modalBottom - scaledOffset.y;
        
        // Only render if we're below the modal
        if (distY < 0.0) {
          return vec4(0.0);
        }
        
        // Calculate horizontal distance from closest point on modal bottom edge
        // This allows shadow to extend horizontally with proper fade
        float closestX = clamp(offsetX, modalLeft, modalRight);
        float distX = abs(offsetX - closestX);
        
        // Calculate distance for circular blur - this creates smooth falloff in all directions
        float dist = sqrt(distX * distX + distY * distY);
        
        // Extend horizontal blur range - allow shadow to extend much further horizontally
        float effectiveBlurRadius = blurRadius * u_devicePixelRatio;
        float horizontalExtension = effectiveBlurRadius * 3.0; // Very large horizontal extension
        
        // Apply blur with Gaussian falloff - use much stronger blur
        float blurIntensity = smoothFalloff(dist, blurRadius);
        
        // Add fog animation - much more visible movement
        vec2 fogCoord = pixelPos / 50.0; // Finer fog pattern for more detail
        float fogFactor = fogTurbulence(fogCoord + vec2(u_time * 0.25, u_time * 0.3), u_time);
        
        // Very visible fog modulation - creates wispy, organic shadows
        float fogModulation = 1.0 + (fogFactor - 0.5) * 0.5;
        // Additional spatial variation for organic, animated look
        float spatialFog = sin(pixelPos.x * 0.02 + u_time * 0.5) * cos(pixelPos.y * 0.015 + u_time * 0.4) * 0.2;
        // Add a slower, larger wave for more noticeable movement
        float slowWave = sin(pixelPos.x * 0.005 + u_time * 0.2) * cos(pixelPos.y * 0.004 + u_time * 0.15) * 0.1;
        fogModulation += spatialFog + slowWave;
        fogModulation = max(fogModulation, 0.4); // Ensure minimum visibility
        
        float intensity = blurIntensity * alpha * fogModulation;
        
        // Apply additional horizontal extension fade - allows shadow to extend much further
        // This creates smooth horizontal edges instead of hard cutoffs
        if (distX > 0.0) {
          // Smoothly fade as we go further from modal edge
          float horizontalFadeDistance = horizontalExtension;
          float horizontalFade = 1.0 - smoothstep(0.0, horizontalFadeDistance, distX);
          // Don't completely kill it, just reduce gradually
          intensity *= mix(0.3, 1.0, horizontalFade);
        }
        
        return vec4(color * intensity, intensity);
      }
      
      void main() {
        vec4 color = vec4(0.0);
        
        // Debug: Check if we're in a valid area
        vec2 pixelPos = v_uv * u_resolution;
        float modalBottom = u_modalPos.y + u_modalSize.y;
        
        // Only render if modal exists and we're below it
        if (u_modalSize.x > 0.0 && u_modalSize.y > 0.0 && pixelPos.y >= modalBottom) {
          // Multi-layer gradient shadow with fog animation
          vec4 layer1 = shadowLayer(
            vec2(-21.0, 202.75),
            138.0,
            vec3(228.0, 238.0, 151.0) / 255.0,
            0.02
          );
          color += layer1;
          
          vec4 layer2 = shadowLayer(
            vec2(-14.0, 166.5),
            126.0,
            vec3(229.0, 90.0, 90.0) / 255.0,
            0.14
          );
          color += layer2;
          
          vec4 layer3 = shadowLayer(
            vec2(-8.0, 88.25),
            106.0,
            vec3(74.0, 234.0, 146.0) / 255.0,
            0.31
          );
          color += layer3;
          
          vec4 layer4 = shadowLayer(
            vec2(-3.0, 19.75),
            79.0,
            vec3(100.0, 128.0, 236.0) / 255.0,
            0.58
          );
          color += layer4;
          
          vec4 layer5 = shadowLayer(
            vec2(-1.0, 10.0),
            43.0,
            vec3(107.0, 107.0, 107.0) / 255.0,
            0.86
          );
          color += layer5;
        }
        
        gl_FragColor = color;
      }
    `

    function createShader(gl, type, source) {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    function createProgram(gl, vertexShader, fragmentShader) {
      const program = gl.createProgram()
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

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)

    if (!program) return
    programRef.current = program

    // Create quad geometry
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    positionBufferRef.current = positionBuffer

    function resizeCanvas() {
      const wrapper = canvas.parentElement
      if (!wrapper) {
        console.warn('WebGL Shadow: No wrapper element found')
        return
      }
      
      if (!modalRef.current) {
        // Canvas should still have dimensions even if modal isn't ready
        const wrapperRect = wrapper.getBoundingClientRect()
        const width = wrapperRect.width || 600
        const height = (wrapperRect.height || 400) + 300
        
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        gl.viewport(0, 0, canvas.width, canvas.height)
        return
      }
      
      const rect = modalRef.current.getBoundingClientRect()
      const wrapperRect = wrapper.getBoundingClientRect()
      
      const width = wrapperRect.width || 600
      const height = (wrapperRect.height || 400) + 300
      
      // Ensure minimum dimensions
      if (canvas.width !== width * window.devicePixelRatio || 
          canvas.height !== height * window.devicePixelRatio) {
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
    }

    function render() {
      if (!isOpen || !overlayRef?.current || !modalRef?.current) {
        if (canvas) canvas.style.opacity = '0'
        return
      }
      
      if (!modalRef.current || !canvas) {
        console.warn('WebGL Shadow: Modal or canvas not available for render')
        return
      }
      
      resizeCanvas()
      canvas.style.opacity = '1'
      
      const gl = glRef.current
      const program = programRef.current
      if (!gl || !program) {
        console.warn('WebGL Shadow: gl or program not available', { gl: !!gl, program: !!program })
        return
      }
      
      gl.useProgram(program)
      
      const positionLocation = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(positionLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      
      const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
      const modalSizeLocation = gl.getUniformLocation(program, 'u_modalSize')
      const modalPosLocation = gl.getUniformLocation(program, 'u_modalPos')
      const devicePixelRatioLocation = gl.getUniformLocation(program, 'u_devicePixelRatio')
      const timeLocation = gl.getUniformLocation(program, 'u_time')
      
      const rect = modalRef.current.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()
      
      // Calculate positions in canvas pixel space
      const modalPosX = (rect.left - canvasRect.left) * window.devicePixelRatio
      const modalPosY = (rect.top - canvasRect.top) * window.devicePixelRatio
      const modalWidth = rect.width * window.devicePixelRatio
      const modalHeight = rect.height * window.devicePixelRatio
      
      // Debug log first few renders
      if (Math.random() < 0.01) {
        console.log('WebGL Shadow Render:', {
          canvasSize: { w: canvas.width, h: canvas.height },
          modalPos: { x: modalPosX, y: modalPosY },
          modalSize: { w: modalWidth, h: modalHeight },
          canvasRect: { left: canvasRect.left, top: canvasRect.top },
          modalRect: { left: rect.left, top: rect.top }
        })
      }
      
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.uniform2f(modalSizeLocation, modalWidth, modalHeight)
      gl.uniform2f(modalPosLocation, modalPosX, modalPosY)
      gl.uniform1f(devicePixelRatioLocation, window.devicePixelRatio || 1.0)
      gl.uniform1f(timeLocation, Date.now() / 1000.0) // Time in seconds for animation
      
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      
      // Check for WebGL errors
      const error = gl.getError()
      if (error !== gl.NO_ERROR) {
        const errorNames = {
          0x0500: 'INVALID_ENUM',
          0x0501: 'INVALID_VALUE',
          0x0502: 'INVALID_OPERATION',
          0x0503: 'INVALID_FRAMEBUFFER_OPERATION',
          0x0504: 'OUT_OF_MEMORY',
          0x0505: 'CONTEXT_LOST_WEBGL'
        }
        console.error('WebGL Shadow error:', errorNames[error] || error, error)
      }
    }

    renderRef.current = render
    canvas.style.opacity = '0'
    
    // Initial canvas resize
    resizeCanvas()

    // Initial render if modal is already open
    if (isOpen && modalRef.current && overlayRef.current) {
      setTimeout(() => {
        resizeCanvas()
        render()
      }, 100)
    }

    // Re-render on resize
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(render, 100)
    }

    window.addEventListener('resize', handleResize)

    // Re-render when modal visibility changes
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
  }, [canvasRef, modalRef, overlayRef, isOpen])

  // Trigger render when isOpen changes
  useEffect(() => {
    if (isOpen && renderRef.current && modalRef?.current && overlayRef?.current) {
      // Small delay to ensure DOM is ready
      const timeout = setTimeout(() => {
        if (renderRef.current) {
          renderRef.current()
        }
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [isOpen, modalRef, overlayRef])

  // Animation loop for fog effect
  useEffect(() => {
    if (!isOpen || !renderRef.current) return
    
    let animationFrameId
    let isRunning = true
    
    function animate() {
      if (!isRunning) return
      
      // Always try to render if refs exist
      if (renderRef.current && overlayRef?.current && modalRef?.current && canvasRef?.current) {
        try {
          renderRef.current()
        } catch (e) {
          console.error('Render error:', e)
        }
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    // Small delay to ensure everything is mounted
    const timeout = setTimeout(() => {
      if (isRunning) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }, 50)
    
    return () => {
      isRunning = false
      clearTimeout(timeout)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isOpen, overlayRef, modalRef, canvasRef])
}
