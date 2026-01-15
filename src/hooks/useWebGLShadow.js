import { useEffect, useRef } from 'react'

export function useWebGLShadow({ isOpen, modalRef, canvasRef, overlayRef }) {
  const glRef = useRef(null)
  const programRef = useRef(null)
  const positionBufferRef = useRef(null)
  const renderRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      console.warn('WebGL not supported')
      return
    }

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
      
      float gaussian(float dist, float sigma) {
        if (sigma <= 0.0) return 0.0;
        return exp(-(dist * dist) / (2.0 * sigma * sigma));
      }
      
      float smoothFalloff(float dist, float blurRadius) {
        float scaledBlur = blurRadius * u_devicePixelRatio;
        float sigma = max(scaledBlur / 1.5, 3.0);
        return gaussian(dist, sigma);
      }
      
      vec4 shadowLayer(vec2 offset, float blurRadius, vec3 color, float alpha) {
        vec2 pixelPos = v_uv * u_resolution;
        vec2 scaledOffset = offset * u_devicePixelRatio;
        
        float modalLeft = u_modalPos.x;
        float modalRight = u_modalPos.x + u_modalSize.x;
        float modalBottom = u_modalPos.y + u_modalSize.y;
        
        if (pixelPos.y < modalBottom) {
          return vec4(0.0);
        }
        
        float offsetX = pixelPos.x - scaledOffset.x;
        bool inModalWidth = offsetX >= modalLeft && offsetX <= modalRight;
        
        if (!inModalWidth) {
          float distFromEdge = min(
            abs(offsetX - modalLeft),
            abs(offsetX - modalRight)
          );
          if (distFromEdge > blurRadius * 0.3) {
            return vec4(0.0);
          }
        }
        
        float distY = pixelPos.y - modalBottom - scaledOffset.y;
        float closestX = clamp(offsetX, modalLeft, modalRight);
        float distX = abs(offsetX - closestX);
        float dist = sqrt(distX * distX * 0.5 + distY * distY);
        float blurIntensity = smoothFalloff(dist, blurRadius);
        float intensity = blurIntensity * alpha;
        
        return vec4(color * intensity, intensity);
      }
      
      void main() {
        vec4 color = vec4(0.0);
        
        vec4 layer1 = shadowLayer(
          vec2(-21.0, 202.75),
          138.0,
          vec3(228.0, 238.0, 151.0) / 255.0,
          0.02 * 5.0
        );
        color += layer1;
        
        vec4 layer2 = shadowLayer(
          vec2(-14.0, 166.5),
          126.0,
          vec3(229.0, 90.0, 90.0) / 255.0,
          0.14 * 2.0
        );
        color += layer2;
        
        vec4 layer3 = shadowLayer(
          vec2(-8.0, 88.25),
          106.0,
          vec3(74.0, 234.0, 146.0) / 255.0,
          0.31 * 1.5
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
      if (!wrapper || !modalRef.current) return
      
      const rect = modalRef.current.getBoundingClientRect()
      const wrapperRect = wrapper.getBoundingClientRect()
      
      const width = wrapperRect.width
      const height = wrapperRect.height + 300
      
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    function render() {
      if (!isOpen || !overlayRef?.current || !modalRef?.current) {
        canvas.style.opacity = '0'
        return
      }
      
      resizeCanvas()
      canvas.style.opacity = '1'
      
      const gl = glRef.current
      const program = programRef.current
      if (!gl || !program) return
      
      gl.useProgram(program)
      
      const positionLocation = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(positionLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      
      const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
      const modalSizeLocation = gl.getUniformLocation(program, 'u_modalSize')
      const modalPosLocation = gl.getUniformLocation(program, 'u_modalPos')
      const devicePixelRatioLocation = gl.getUniformLocation(program, 'u_devicePixelRatio')
      
      const rect = modalRef.current.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()
      
      const modalPosX = (rect.left - canvasRect.left) * window.devicePixelRatio
      const modalPosY = (rect.top - canvasRect.top) * window.devicePixelRatio
      const modalWidth = rect.width * window.devicePixelRatio
      const modalHeight = rect.height * window.devicePixelRatio
      
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.uniform2f(modalSizeLocation, modalWidth, modalHeight)
      gl.uniform2f(modalPosLocation, modalPosX, modalPosY)
      gl.uniform1f(devicePixelRatioLocation, window.devicePixelRatio || 1.0)
      
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    renderRef.current = render
    canvas.style.opacity = '0'

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

  useEffect(() => {
    if (renderRef.current && isOpen) {
      setTimeout(renderRef.current, 100)
    }
  }, [isOpen])
}
