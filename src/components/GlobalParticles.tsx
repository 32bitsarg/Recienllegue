'use client'

import { useEffect, useRef } from 'react'

// Figuras geométricas flotando en el fondo de toda la app.
// position: fixed — cubre todo el viewport detrás del contenido.
// Colores sutiles oscuro-verde sobre el fondo claro #F1F5F9.

export default function GlobalParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rawCtx = canvas.getContext('2d')
    if (!rawCtx) return
    const ctx: CanvasRenderingContext2D = rawCtx

    type Shape = 'circle' | 'dot' | 'line' | 'arc' | 'cross' | 'triangle'
    const SHAPES: Shape[] = ['circle', 'dot', 'line', 'arc', 'cross', 'triangle']

    interface Particle {
      x: number; y: number; z: number
      vx: number; vy: number
      size: number; opacity: number
      shape: Shape
      rotation: number; rotSpeed: number
    }

    let w = 0
    let h = 0

    function mkParticle(randomY = false): Particle {
      const z = Math.random()
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -60,
        z,
        vx: (Math.random() - 0.5) * 0.22,
        vy: 0.1 + z * 0.35,
        size: 6 + z * 28,
        // Visible pero no invasivo sobre fondo claro
        opacity: 0.07 + z * 0.18,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.014,
      }
    }

    const COUNT = 120
    let particles: Particle[] = []

    function drawShape(p: Particle) {
      const s = p.size
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.opacity
      // Verde oscuro sobre fondo claro
      ctx.strokeStyle = '#0F172A'
      ctx.fillStyle = '#0F172A'
      ctx.lineWidth = 1.1

      switch (p.shape) {
        case 'circle':
          ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke()
          break
        case 'dot':
          ctx.beginPath(); ctx.arc(0, 0, Math.max(1, s * 0.14), 0, Math.PI * 2); ctx.fill()
          break
        case 'line':
          ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.stroke()
          break
        case 'arc':
          ctx.beginPath(); ctx.arc(0, 0, s, 0.3, Math.PI * 0.9); ctx.stroke()
          break
        case 'cross':
          ctx.beginPath()
          ctx.moveTo(-s * 0.5, 0); ctx.lineTo(s * 0.5, 0)
          ctx.moveTo(0, -s * 0.5); ctx.lineTo(0, s * 0.5)
          ctx.stroke()
          break
        case 'triangle':
          ctx.beginPath()
          ctx.moveTo(0, -s)
          ctx.lineTo(s * 0.866, s * 0.5)
          ctx.lineTo(-s * 0.866, s * 0.5)
          ctx.closePath(); ctx.stroke()
          break
      }
      ctx.restore()
    }

    let animId: number
    let running = true

    function tick() {
      if (!running) return
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        drawShape(p)
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotSpeed
        if (p.y > h + 50) Object.assign(p, mkParticle(false))
        if (p.x < -50) p.x = w + 50
        if (p.x > w + 50) p.x = -50
      }
      animId = requestAnimationFrame(tick)
    }

    const cvs: HTMLCanvasElement = canvas

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      cvs.width = w
      cvs.height = h
      if (particles.length === 0)
        particles = Array.from({ length: COUNT }, () => mkParticle(true))
    }

    window.addEventListener('resize', resize)
    resize()
    tick()

    return () => {
      running = false
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
