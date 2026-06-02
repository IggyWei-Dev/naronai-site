'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl'
import './Threads.css'

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;
uniform bool uEnableMouse;

#define PI 3.14159265359

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), u);
}

float threadLine(vec2 uv, float yCenter, float t, float seed) {
  float freq1 = 1.8 + seed * 0.7;
  float freq2 = 3.2 + seed * 0.4;
  float freq3 = 0.6 + seed * 0.3;

  float phase = seed * 6.283;

  float wave = sin(uv.x * freq1 + t * 0.8 + phase) * 0.4;
  wave += sin(uv.x * freq2 - t * 0.5 + phase * 1.3) * 0.2;
  wave += sin(uv.x * freq3 + t * 0.3 + phase * 0.7) * 0.4;

  float mouseEffect = 0.0;
  if (uEnableMouse) {
    float mDist = abs(uv.x - uMouse.x);
    mouseEffect = 0.18 * exp(-mDist * mDist * 8.0) * sin((uv.x - uMouse.x) * 10.0 + t * 2.0);
  }

  float y = yCenter + wave * uAmplitude + mouseEffect;
  float dist = abs(uv.y - y);
  float thickness = 0.00055 + 0.00025 * (1.0 + sin(uv.x * 2.0 + t + phase));

  return smoothstep(thickness * 2.5, thickness * 0.5, dist);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;

  float color = 0.0;
  int count = 24;

  for (int i = 0; i < 24; i++) {
    float fi = float(i);
    float t = float(count);
    float yPos = mix(-1.0, 1.0, fi / (t - 1.0)) * uDistance;
    float seed = fi * 0.137 + 0.031;
    float alpha = 0.4 + 0.6 * (1.0 - abs(fi / (t - 1.0) - 0.5) * 2.0);
    color += threadLine(uv, yPos, iTime, seed) * alpha;
  }

  color = clamp(color, 0.0, 1.0);
  gl_FragColor = vec4(uColor * color, color);
}
`

interface ThreadsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  color?: [number, number, number]
  amplitude?: number
  distance?: number
  enableMouseInteraction?: boolean
}

export default function Threads({
  color = [1, 1, 1],
  amplitude = 1.0,
  distance = 0.5,
  enableMouseInteraction = true,
  ...rest
}: ThreadsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cr, cg, cb] = color

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false, antialias: true })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let program: any
    let targetMouse = { x: 0.5, y: 0.5 }
    let currentMouse = { x: 0.5, y: 0.5 }

    function handleMouseMove(e: MouseEvent) {
      const rect = (gl.canvas as HTMLCanvasElement).getBoundingClientRect()
      targetMouse = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      }
    }

    function handleMouseLeave() {
      targetMouse = { x: 0.5, y: 0.5 }
    }

    function resize() {
      renderer.setSize(container.offsetWidth, container.offsetHeight)
      if (program) {
        program.uniforms.iResolution.value = [
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        ]
      }
    }

    window.addEventListener('resize', resize)
    resize()

    const geometry = new Triangle(gl)
    const threadColor = new Color(cr, cg, cb)

    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height],
        },
        uColor: { value: [threadColor.r, threadColor.g, threadColor.b] },
        uAmplitude: { value: amplitude },
        uDistance: { value: distance },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uEnableMouse: { value: enableMouseInteraction },
      },
      transparent: true,
    })

    const mesh = new Mesh(gl, { geometry, program })
    container.appendChild(gl.canvas)

    if (enableMouseInteraction) {
      ;(gl.canvas as HTMLCanvasElement).addEventListener('mousemove', handleMouseMove)
      ;(gl.canvas as HTMLCanvasElement).addEventListener('mouseleave', handleMouseLeave)
    }

    let rafId: number

    function update(time: number) {
      rafId = requestAnimationFrame(update)
      program.uniforms.iTime.value = time * 0.001

      if (enableMouseInteraction) {
        currentMouse.x += 0.04 * (targetMouse.x - currentMouse.x)
        currentMouse.y += 0.04 * (targetMouse.y - currentMouse.y)
        program.uniforms.uMouse.value[0] = currentMouse.x
        program.uniforms.uMouse.value[1] = currentMouse.y
      }

      renderer.render({ scene: mesh })
    }

    rafId = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      if (enableMouseInteraction) {
        ;(gl.canvas as HTMLCanvasElement).removeEventListener('mousemove', handleMouseMove)
        ;(gl.canvas as HTMLCanvasElement).removeEventListener('mouseleave', handleMouseLeave)
      }
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [cr, cg, cb, amplitude, distance, enableMouseInteraction])

  return <div ref={containerRef} className="threads-container" {...rest} />
}
