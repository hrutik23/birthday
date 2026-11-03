// Tiny canvas confetti + fireworks engine (no dependencies).
const COLORS = ['#ff8fb7', '#ffd6e5', '#e3d4ff', '#ffd5bd', '#fff2b3', '#d9a38f', '#b48cff', '#ffffff']
let canvas, ctx, parts = [], raf = 0

const ensure = () => {
  if (canvas) return
  canvas = document.createElement('canvas')
  Object.assign(canvas.style, { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 95 })
  document.body.appendChild(canvas)
  ctx = canvas.getContext('2d')
  const size = () => {
    const d = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = innerWidth * d; canvas.height = innerHeight * d
    ctx.setTransform(d, 0, 0, d, 0, 0)
  }
  size(); addEventListener('resize', size)
}

const heart = (c, s) => {
  c.beginPath(); c.moveTo(0, s * .3)
  c.bezierCurveTo(-s, -s * .5, -s * .4, -s, 0, -s * .35)
  c.bezierCurveTo(s * .4, -s, s, -s * .5, 0, s * .3)
  c.fill()
}
const star = (c, s) => {
  c.beginPath()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? s * .45 : s, a = i * Math.PI / 5 - Math.PI / 2
    c.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  c.closePath(); c.fill()
}

function loop() {
  ctx.clearRect(0, 0, innerWidth, innerHeight)
  parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 40)
  for (const p of parts) {
    p.vy += p.g; p.vx *= p.drag; p.vy *= p.drag
    p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot)
    ctx.globalAlpha = Math.min(1, p.life / 25); ctx.fillStyle = p.color
    if (p.shape === 'heart') heart(ctx, p.size)
    else if (p.shape === 'star') star(ctx, p.size)
    else if (p.shape === 'dot') { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, 7); ctx.fill() }
    else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
    ctx.restore()
  }
  if (parts.length) raf = requestAnimationFrame(loop)
  else { ctx.clearRect(0, 0, innerWidth, innerHeight); raf = 0 }
}

const add = (p) => { parts.push(p); if (!raf) raf = requestAnimationFrame(loop) }
const rnd = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]

export function burst({ x = innerWidth / 2, y = innerHeight / 2, count = 90, spread = Math.PI * 2, angle = -Math.PI / 2, power = 11, shapes = ['rect', 'heart', 'star', 'dot'] } = {}) {
  ensure()
  const n = innerWidth < 500 ? Math.round(count * .65) : count
  for (let i = 0; i < n; i++) {
    const a = angle + rnd(-spread / 2, spread / 2), v = rnd(power * .4, power)
    add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: .22, drag: .985, rot: rnd(0, 6), vr: rnd(-.2, .2), size: rnd(7, 14), color: pick(COLORS), shape: pick(shapes), life: rnd(90, 160) })
  }
}

export function rain(duration = 2500) {
  ensure()
  const end = performance.now() + duration
  const tick = () => {
    for (let i = 0; i < 3; i++) add({ x: rnd(0, innerWidth), y: -10, vx: rnd(-1, 1), vy: rnd(2, 4), g: .03, drag: .995, rot: rnd(0, 6), vr: rnd(-.1, .1), size: rnd(7, 13), color: pick(COLORS), shape: pick(['rect', 'heart', 'star']), life: 260 })
    if (performance.now() < end) setTimeout(tick, 60)
  }
  tick()
}

export function firework(x = rnd(innerWidth * .15, innerWidth * .85), y = rnd(innerHeight * .15, innerHeight * .5)) {
  ensure()
  const color = pick(COLORS.slice(0, 6))
  for (let i = 0; i < 46; i++) {
    const a = (i / 46) * Math.PI * 2, v = rnd(3, 7)
    add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: .06, drag: .96, rot: 0, vr: 0, size: rnd(4, 7), color, shape: Math.random() < .3 ? 'heart' : 'dot', life: rnd(55, 90) })
  }
}

export function fireworks(n = 6) {
  for (let i = 0; i < n; i++) setTimeout(() => {
    firework()
    if (i % 2 === 0) burst({ y: innerHeight, x: rnd(0, innerWidth), count: 30, spread: 1, power: 16 })
  }, i * 450)
}
