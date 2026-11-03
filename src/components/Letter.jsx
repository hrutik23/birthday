import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { config } from '../config'
import { burst } from '../lib/confetti'
import { SectionTitle } from './Decor'

function useTyping(text, run, speed = 32) {
  const chars = Array.from(text)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    const id = setInterval(() => setN(v => (v >= chars.length ? (clearInterval(id), v) : v + 1)), speed)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, text])
  return [chars.slice(0, n).join(''), n >= chars.length]
}

export default function Letter() {
  const [open, setOpen] = useState(false)
  const [typed, done] = useTyping(config.letter, open)

  const openIt = (e) => {
    if (open) return
    setOpen(true)
    const r = e.currentTarget.getBoundingClientRect()
    burst({ x: r.left + r.width / 2, y: r.top + 30, count: 40, power: 9, shapes: ['heart'] })
  }

  return (
    <section id="letter" data-section className="relative px-5 py-24">
      <SectionTitle emoji="💗" sub={open ? '' : 'tap the envelope to open it'}>A Little Note From My Heart</SectionTitle>
      <div className="mx-auto max-w-md">
        <motion.div className="relative mx-auto" style={{ width: 'min(100%, 340px)', height: 220 }} animate={open ? { marginBottom: 0 } : {}} >
          <button onClick={openIt} aria-label="Open the letter" className="absolute inset-0 z-20 cursor-pointer border-0 bg-transparent p-0" style={{ pointerEvents: open ? 'none' : 'auto' }}>
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ffd5bd] to-[#ffb3cf] shadow-xl ${open ? '' : 'wiggle'}`} />
            {/* flap */}
            <motion.div className="absolute inset-x-0 top-0 h-28 origin-top" style={{ zIndex: open ? 0 : 3 }} animate={{ rotateX: open ? 180 : 0 }} transition={{ duration: .7 }}>
              <div className="h-full w-full rounded-t-2xl bg-gradient-to-b from-[#ffc6dc] to-[#ffb3cf]" style={{ clipPath: 'polygon(0 0,100% 0,50% 100%)' }} />
            </motion.div>
            {/* front pocket */}
            <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg,#ffe3d2 0%,#ffd0dd 100%)', clipPath: 'polygon(0 100%,0 30%,50% 65%,100% 30%,100% 100%)' }} />
            <motion.span className="absolute left-1/2 top-[48%] z-10 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[#ff7fae] to-[#e0557f] shadow-lg" animate={{ scale: open ? 0 : [1, 1.1, 1] }} transition={open ? {} : { repeat: Infinity, duration: 1.5 }}>
              <Heart size={26} fill="#fff" color="#fff" />
            </motion.span>
          </button>
        </motion.div>

        <motion.div initial={false} animate={open ? { opacity: 1, y: -40, height: 'auto' } : { opacity: 0, y: 40, height: 0 }} transition={{ duration: .9, delay: open ? .5 : 0 }} className="relative z-10 overflow-hidden">
          <div className="relative rounded-xl p-6 pt-14 shadow-xl sm:p-8 sm:pt-14" style={{ background: 'repeating-linear-gradient(#fffdf8, #fffdf8 33px, #f6d9e4 34px)' }}>
            <div className="absolute left-5 top-0 h-full w-px bg-rosy/40" />
            <div className="grid pl-3 font-hand text-[1.6rem] leading-[34px] text-ink sm:text-3xl sm:leading-[34px]">
              <p className="invisible whitespace-pre-wrap [grid-area:1/1]" aria-hidden="true">{config.letter}</p>
              <p className={`whitespace-pre-wrap [grid-area:1/1] ${done ? '' : 'caret'}`} aria-label={config.letter}>{typed}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
