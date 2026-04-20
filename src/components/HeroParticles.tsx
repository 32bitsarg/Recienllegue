'use client'

import { useEffect, useRef } from 'react'

// Partículas mint sobre fondo oscuro — para usar en heroes de sección.
// Canvas position:absolute, el padre debe tener position:relative + overflow:hidden.

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rawCtx = canvas.getContext('2d')
    if (!rawCtx) return
    const ctx: CanvasRenderingContext2D = rawCtx
    const cvs: HTMLCanvasElement = canvas

    type Shape = 'circle' | 'dot' | 'line' | 'arc' | 'cross' | 'triangle'
    const SHAPES: Shape[] = ['circle', 'dot', 'line', 'arc', 'cross', 'triangle']

    interface Particle {
      x: number; y: number; z: number
      vx: number; vy: number
      size: number; opacity: number
      shape: Shape
      rotation: number; rotSpeed: number
    }

    let w = 0; let h = 0

    function mkParticle(randomY = false): Particle {
      const z = Math.random()
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -40,
        z,
        vx: (Math.random() - 0.5) * 0.25,
        vy: 0.12 + z * 0.38,
        size: 3 + z * 18,
        opacity: 0.05 + z * 0.2,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.018,
      }
    }

    const COUNT = 45
    let particles: Particle[] = []

    function draw(p: Particle) {
      const s = p.size
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.opacity
      ctx.strokeStyle = '#E2E8F0'
      ctx.fillStyle = '#E2E8F0'
      ctx.lineWidth = 0.9

      switch (p.shape) {
        case 'circle':  ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke(); break
        case 'dot':     ctx.beginPath(); ctx.arc(0, 0, Math.max(1, s * 0.15), 0, Math.PI * 2); ctx.fill(); break
        case 'line':    ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.stroke(); break
        case 'arc':     ctx.beginPath(); ctx.arc(0, 0, s, 0.2, Math.PI * 0.85); ctx.stroke(); break
        case 'cross':
          ctx.beginPath()
          ctx.moveTo(-s * 0.5, 0); ctx.lineTo(s * 0.5, 0)
          ctx.moveTo(0, -s * 0.5); ctx.lineTo(0, s * 0.5)
          ctx.stroke(); break
        case 'triangle':
          ctx.beginPath()
          ctx.moveTo(0, -s)
          ctx.lineTo(s * 0.866, s * 0.5)
          ctx.lineTo(-s * 0.866, s * 0.5)
          ctx.closePath(); ctx.stroke(); break
      }
      ctx.restore()
    }

    let animId: number
    let running = true

    function tick() {
      if (!running) return
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        draw(p)
        p.x += p.vx; p.y += p.vy; p.rotation += p.rotSpeed
        if (p.y > h + 40) Object.assign(p, mkParticle(false))
        if (p.x < -40) p.x = w + 40
        if (p.x > w + 40) p.x = -40
      }
      animId = requestAnimationFrame(tick)
    }

    function resize() {
      w = cvs.offsetWidth
      h = cvs.offsetHeight
      cvs.width = w
      cvs.height = h
      if (particles.length === 0)
        particles = Array.from({ length: COUNT }, () => mkParticle(true))
    }

    const ro = new ResizeObserver(resize)
    ro.observe(cvs)
    resize()
    tick()
    return () => { running = false; cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  )
}
