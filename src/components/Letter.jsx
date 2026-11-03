import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { config } from '../config'
import { burst } from '../lib/confetti'
import { Doodles, SectionTitle } from './Decor'

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

const W = 300, H = 200, FLAP = 112

function Envelope({ open, onOpen }) {
  return (
    <div className="relative mx-auto" style={{ width: W, maxWidth: '100%', marginTop: FLAP * .7 }}>
      <div
        role="button" tabIndex={open ? -1 : 0} aria-label="Open the letter" aria-disabled={open}
        onClick={onOpen} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(e))}
        className={`relative cursor-pointer select-none outline-none ${open ? '' : 'wiggle'}`}
        style={{ width: '100%', aspectRatio: `${W} / ${H}`, filter: 'drop-shadow(0 18px 22px rgba(217,120,150,.35))' }}
      >
        {/* back of envelope */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ffc9b3] to-[#ff9fbf]" />

        {/* letter card peeking inside, rises out when opened */}
        <motion.div
          className="absolute left-[7%] right-[7%] top-[8%] z-10 h-[88%] rounded-lg bg-[#fffdf8] p-4 shadow-md"
          style={{ background: 'repeating-linear-gradient(#fffdf8, #fffdf8 15px, #f6d9e4 16px)' }}
          initial={false}
          animate={open ? { y: -FLAP * 1.15, opacity: [1, 1, 0] } : { y: 0, opacity: 1 }}
          transition={{ duration: 1.1, delay: open ? .55 : 0, ease: 'easeInOut' }}
        >
          <span className="font-hand text-xl text-ink/70">Dear you,</span>
        </motion.div>

        {/* front pocket (left / right / bottom folds) */}
        <div className="absolute inset-0 z-20 overflow-hidden rounded-2xl">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#ffd9c8,#ffc2d4)', clipPath: 'polygon(0 0, 52% 54%, 0 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(225deg,#ffd9c8,#ffc2d4)', clipPath: 'polygon(100% 0, 48% 54%, 100% 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#ffe6da,#ffd3e0)', clipPath: 'polygon(0 100%, 50% 46%, 100% 100%)' }} />
          <span className="absolute inset-x-0 bottom-3 text-center font-hand text-2xl text-ink/60">to: you 💌</span>
        </div>

        {/* flap: hinged at the top edge */}
        <motion.div
          className="absolute left-0 top-0 w-full"
          style={{ height: FLAP, perspective: 900, pointerEvents: 'none' }}
          initial={false}
          animate={{ zIndex: open ? 5 : 30 }}
          transition={{ zIndex: { delay: open ? .3 : 0, duration: 0 } }}
        >
          <motion.div
            className="relative h-full w-full [transform-style:preserve-3d]"
            style={{ transformOrigin: 'top center' }}
            initial={false}
            animate={{ rotateX: open ? -180 : 0 }}
            transition={{ duration: .7, ease: 'easeInOut' }}
          >
            <svg className="absolute inset-0 h-full w-full [backface-visibility:hidden]" viewBox={`0 0 ${W} ${FLAP}`} preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="flapOut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffbcd3" /><stop offset="1" stopColor="#ff9fbf" /></linearGradient></defs>
              <path d={`M0 18 Q0 0 18 0 H${W - 18} Q${W} 0 ${W} 18 L${W / 2 + 10} ${FLAP - 10} Q${W / 2} ${FLAP} ${W / 2 - 10} ${FLAP - 10} Z`} fill="url(#flapOut)" />
            </svg>
            <svg className="absolute inset-0 h-full w-full [backface-visibility:hidden]" viewBox={`0 0 ${W} ${FLAP}`} preserveAspectRatio="none" aria-hidden="true" style={{ transform: 'rotateX(180deg)' }}>
              <path transform={`translate(0 ${FLAP}) scale(1 -1)`} d={`M0 18 Q0 0 18 0 H${W - 18} Q${W} 0 ${W} 18 L${W / 2 + 10} ${FLAP - 10} Q${W / 2} ${FLAP} ${W / 2 - 10} ${FLAP - 10} Z`} fill="#ffd3c0" />
            </svg>
          </motion.div>
        </motion.div>

        {/* heart wax seal at the flap tip */}
        <motion.div
          className="pointer-events-none absolute left-1/2 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#ff7fae] to-[#d9467a] shadow-lg ring-4 ring-[#ff9fbf]/60"
          style={{ top: FLAP - 34, x: '-50%' }}
          initial={false}
          animate={open ? { scale: 0, rotate: 90, opacity: 0 } : { scale: [1, 1.1, 1], rotate: 0, opacity: 1 }}
          transition={open ? { duration: .3 } : { repeat: Infinity, duration: 1.6 }}
        >
          <Heart size={26} fill="#fff" color="#fff" />
        </motion.div>
      </div>
    </div>
  )
}

export default function Letter() {
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [typed, done] = useTyping(config.letter, typing)

  const openIt = (e) => {
    if (open) return
    setOpen(true)
    const r = e.currentTarget.getBoundingClientRect()
    burst({ x: r.left + r.width / 2, y: r.top + 20, count: 40, power: 9, shapes: ['heart'] })
    setTimeout(() => setTyping(true), 1500)
  }

  return (
    <section id="letter" data-section className="relative px-5 py-24">
      <Doodles items={[
        ['heart', 'top-24 left-[6%] rotate-12'],
        ['flower', 'top-40 right-[6%] -rotate-6 hidden sm:block'],
        ['xoxo', 'bottom-24 left-[7%] -rotate-6'],
      ]} />
      <SectionTitle emoji="💗" sub={open ? '' : 'tap the envelope to open it'}>A Little Note From My Heart</SectionTitle>
      <div className="mx-auto max-w-md">
        <Envelope open={open} onOpen={openIt} />

        <motion.div
          initial={false}
          animate={open ? { opacity: 1, height: 'auto', y: 0 } : { opacity: 0, height: 0, y: 30 }}
          transition={{ duration: .9, delay: open ? 1.2 : 0, ease: 'easeOut' }}
          className="relative mt-6 overflow-hidden rounded-xl shadow-xl"
        >
          <div className="relative p-6 pt-8 sm:p-8" style={{ background: 'repeating-linear-gradient(#fffdf8, #fffdf8 33px, #f6d9e4 34px)' }}>
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
