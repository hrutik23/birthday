import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Flower2, Heart, Smile, Sparkles, Star } from 'lucide-react'
import { config } from '../config'
import { burst } from '../lib/confetti'
import { Reveal, SectionTitle } from './Decor'

const ICONS = { smile: Smile, sparkles: Sparkles, flower: Flower2, star: Star, heart: Heart, crown: Crown }
const TINTS = ['from-[#ffd6e5] to-[#ffb3cf]', 'from-[#e3d4ff] to-[#c9a8ff]', 'from-[#ffd5bd] to-[#ffbf9e]', 'from-[#fff2b3] to-[#ffe27a]', 'from-[#ffd6e5] to-[#e3d4ff]', 'from-[#ffe9d9] to-[#ffc3d6]']

function FlipCard({ item, i, onFlip }) {
  const [flipped, setFlipped] = useState(false)
  const Icon = ICONS[item.icon] || Heart
  const toggle = (e) => {
    if (!flipped) { onFlip(i); const r = e.currentTarget.getBoundingClientRect(); burst({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 24, power: 7, shapes: ['heart', 'star'] }) }
    setFlipped(f => !f)
  }
  return (
    <Reveal delay={(i % 2) * .1}>
      <button onClick={toggle} aria-pressed={flipped} aria-label={`${item.title}: tap to ${flipped ? 'hide' : 'reveal'}`} className="block h-44 w-full cursor-pointer border-0 bg-transparent p-0 [perspective:900px] sm:h-52">
        <motion.div className="relative h-full w-full [transform-style:preserve-3d]" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }} whileHover={{ y: -4 }}>
          <div className="glass absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl [backface-visibility:hidden]">
            <span className={`grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${TINTS[i % 6]} text-white shadow-md wiggle`}><Icon size={30} /></span>
            <span className="font-hand text-2xl text-ink">{item.title}</span>
            <span className="text-xs text-ink/50">tap to reveal 💌</span>
          </div>
          <div className={`absolute inset-0 flex items-center justify-center rounded-3xl bg-gradient-to-br ${TINTS[i % 6]} p-5 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]`}>
            <p className="font-hand text-2xl leading-snug text-ink sm:text-3xl">{item.message}</p>
          </div>
        </motion.div>
      </button>
    </Reveal>
  )
}

export default function Reasons({ onAllFlipped }) {
  const [seen] = useState(() => new Set())
  const flip = (i) => { seen.add(i); if (seen.size === config.reasons.length) onAllFlipped?.() }
  return (
    <section id="reasons" data-section className="relative px-5 py-24 sm:px-8">
      <SectionTitle emoji="💌" sub="flip every card to see them all">A Few Reasons Why You're So Special</SectionTitle>
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
        {config.reasons.map((r, i) => <FlipCard key={i} item={r} i={i} onFlip={flip} />)}
      </div>
    </section>
  )
}
