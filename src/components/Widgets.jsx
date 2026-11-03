import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Music, VolumeX } from 'lucide-react'
import { config } from '../config'
import { burst } from '../lib/confetti'
import { toggleMusic } from '../lib/music'

export function MusicToggle() {
  const [on, setOn] = useState(false)
  return (
    <button onClick={() => setOn(toggleMusic())} aria-label={on ? 'Mute music' : 'Play music'} aria-pressed={on}
      className="glass fixed right-3 top-5 z-[60] grid h-12 w-12 cursor-pointer place-items-center rounded-full text-ink">
      {on ? <Music size={20} className="wiggle" /> : <VolumeX size={20} />}
    </button>
  )
}

export function ComplimentButton() {
  const [msg, setMsg] = useState(null)
  const last = useRef(-1)
  const timer = useRef()
  const pop = (e) => {
    let i; do { i = (Math.random() * config.compliments.length) | 0 } while (i === last.current && config.compliments.length > 1)
    last.current = i; setMsg({ text: config.compliments[i], id: Date.now() })
    const r = e.currentTarget.getBoundingClientRect()
    burst({ x: r.left + r.width / 2, y: r.top, count: 14, power: 6, shapes: ['heart'], spread: 1.6 })
    clearTimeout(timer.current); timer.current = setTimeout(() => setMsg(null), 3800)
  }
  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {msg && (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 12, scale: .8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} role="status"
            className="glass max-w-[15rem] rounded-3xl rounded-br-md px-4 py-3 font-hand text-xl text-ink">{msg.text}</motion.div>
        )}
      </AnimatePresence>
      <motion.button whileTap={{ scale: .85 }} onClick={pop} aria-label="Get a sweet compliment"
        className="pulse-heart grid h-14 w-14 cursor-pointer place-items-center rounded-full border-0 bg-gradient-to-br from-[#ff9ec4] to-[#ff7fae] text-white shadow-[0_8px_20px_rgba(255,127,174,.55)]">
        <Heart size={26} fill="#fff" />
      </motion.button>
    </div>
  )
}

export function ProgressBar({ ids }) {
  const [seen, setSeen] = useState(() => new Set())
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach(e => e.isIntersecting && setSeen(s => (s.has(e.target.id) ? s : new Set(s).add(e.target.id)))), { threshold: .35 })
    ids.forEach(id => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [ids])
  const pct = Math.round((seen.size / ids.length) * 100)
  return (
    <div className="fixed inset-x-0 top-0 z-[60] px-3 pt-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Surprise explored">
      <div className="mr-14 flex items-center gap-2">
        <div className="relative flex-1 py-2">
          <div className="glass h-3 overflow-hidden rounded-full p-[2px]">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-[#ff9ec4] via-[#ffb58f] to-[#c9a8ff]" animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 80, damping: 18 }} />
          </div>
          <motion.div className="absolute top-0 -translate-x-1/2" animate={{ left: `${pct}%` }} transition={{ type: 'spring', stiffness: 80, damping: 18 }} aria-hidden="true">
            <Heart size={18} fill="#ff7fae" color="#ff7fae" className="drop-shadow-md" />
          </motion.div>
        </div>
        <span className="min-w-[3.2rem] text-right text-xs font-bold text-ink">{pct}% 💗</span>
      </div>
    </div>
  )
}

const GLYPHS = ['✦', '♥', '✧', '❀']
const COLS = ['#ff8fb7', '#c9a8ff', '#ffc3a0', '#ffe27a']
export function CursorSparkles() {
  useEffect(() => {
    let last = 0
    const spawn = (x, y, n = 1) => {
      for (let k = 0; k < n; k++) {
        const el = document.createElement('span')
        el.className = 'sparkle-dot'
        el.textContent = GLYPHS[(Math.random() * 4) | 0]
        el.style.cssText = `left:${x + (Math.random() - .5) * 20}px;top:${y + (Math.random() - .5) * 20}px;color:${COLS[(Math.random() * 4) | 0]};font-size:${10 + Math.random() * 12}px`
        document.body.appendChild(el)
        setTimeout(() => el.remove(), 850)
      }
    }
    const move = (e) => { if (e.pointerType !== 'mouse') return; const t = performance.now(); if (t - last < 45) return; last = t; spawn(e.clientX, e.clientY) }
    const down = (e) => spawn(e.clientX, e.clientY, e.pointerType === 'mouse' ? 3 : 5)
    addEventListener('pointermove', move, { passive: true }); addEventListener('pointerdown', down, { passive: true })
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerdown', down) }
  }, [])
  return null
}
