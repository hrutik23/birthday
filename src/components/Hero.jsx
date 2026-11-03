import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Wand2, Flame } from 'lucide-react'
import { config } from '../config'
import { burst, rain } from '../lib/confetti'
import { Doodles, FloatingItems } from './Decor'

const CANDLES = [{ x: 28, c: '#ffb3cf' }, { x: 50, c: '#c9a8ff' }, { x: 72, c: '#ffe27a' }]

function Cake({ lit }) {
  return (
    <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72" role="img" aria-label="Birthday cake with candles">
      {/* plate */}
      <div className="absolute bottom-0 left-1/2 h-4 w-64 -translate-x-1/2 rounded-full bg-white/80 shadow-lg sm:w-72" />
      {/* bottom tier */}
      <div className="absolute bottom-3 left-1/2 h-24 w-56 -translate-x-1/2 overflow-hidden rounded-2xl bg-gradient-to-b from-[#ffd5bd] to-[#ffb99b] sm:w-60">
        <div className="absolute inset-x-0 top-0 h-6 bg-white" style={{ clipPath: 'polygon(0 0,100% 0,100% 40%,92% 100%,84% 40%,74% 100%,64% 40%,54% 100%,44% 40%,34% 100%,24% 40%,14% 100%,6% 40%,0 70%)' }} />
        {[20, 50, 80].map(l => <span key={l} className="absolute bottom-4 h-3 w-3 rounded-full bg-white/70" style={{ left: `${l}%` }} />)}
      </div>
      {/* top tier */}
      <div className="absolute bottom-[6.5rem] left-1/2 h-20 w-40 -translate-x-1/2 overflow-hidden rounded-2xl bg-gradient-to-b from-[#ffc6dc] to-[#ff9ec4] sm:w-44">
        <div className="absolute inset-x-0 top-0 h-5 bg-[#fff8f0]" style={{ clipPath: 'polygon(0 0,100% 0,100% 50%,90% 100%,78% 50%,66% 100%,54% 50%,42% 100%,30% 50%,18% 100%,8% 50%,0 80%)' }} />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xl pulse-heart">💗</span>
      </div>
      {/* cherries / candles */}
      <div className="absolute bottom-[11.4rem] left-1/2 h-16 w-40 -translate-x-1/2 sm:w-44">
        {CANDLES.map(({ x, c }, i) => (
          <div key={i} className="absolute bottom-0 -translate-x-1/2" style={{ left: `${x}%` }}>
            <div className="relative mx-auto h-11 w-3 rounded-t-sm" style={{ background: `repeating-linear-gradient(45deg, ${c}, ${c} 5px, #fff 5px, #fff 10px)` }}>
              <AnimatePresence>
                {lit && (
                  <motion.div key="f" className="absolute -top-6 left-1/2 -translate-x-1/2" exit={{ opacity: 0, scale: 0 }}>
                    <div className="flame h-5 w-3 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-[#ff9a3c] via-[#ffd24d] to-white shadow-[0_0_18px_8px_rgba(255,210,77,.6)]" style={{ animationDelay: `${i * .15}s` }} />
                  </motion.div>
                )}
              </AnimatePresence>
              {!lit && <span className="absolute -top-8 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-gray-300/70 blur-[2px]" style={{ animation: `smoke 1.6s ease-out ${i * .12}s forwards` }} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero({ active }) {
  const [lit, setLit] = useState(true)
  const [wished, setWished] = useState(false)

  const wish = () => {
    if (lit) {
      setLit(false); setWished(true)
      burst({ x: innerWidth / 2, y: innerHeight * .55, count: 110, power: 13 }); rain(1800)
    } else {
      setLit(true); setWished(false)
    }
  }

  return (
    <section id="hero" data-section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-5 py-16">
      <FloatingItems kinds={['balloon', 'heart', 'sparkle', 'star', 'balloon', 'butterfly']} count={16} parallax={50} />
      <Doodles items={[
        ['squiggle', 'top-24 left-[6%] rotate-6 hidden sm:block'],
        ['heart', 'top-1/4 right-[7%] -rotate-12'],
        ['arrow', 'bottom-32 left-[8%] rotate-12 hidden sm:block'],
        ['star', 'bottom-40 right-[9%] rotate-6'],
        ['xoxo', 'top-[60%] left-[5%] rotate-12'],
      ]} />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <motion.h1 initial={{ opacity: 0, scale: .8 }} animate={active ? { opacity: 1, scale: 1 } : {}} transition={{ type: 'spring', delay: .1 }} className="title-script text-4xl leading-snug sm:text-6xl">
          {config.hero.title.replace('{name}', config.name)}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: .6 }} className="mx-auto mt-5 max-w-md text-base text-ink/80 sm:text-lg">
          {config.hero.subtitle}
        </motion.p>
        <div className="my-10"><Cake lit={lit} /></div>
        <div className="min-h-16">
          <AnimatePresence mode="wait">
            {wished && (
              <motion.p key="m" initial={{ opacity: 0, y: 10, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="glass mx-auto mb-5 inline-block rounded-3xl px-6 py-3 font-hand text-2xl sm:text-3xl">
                {config.hero.wishMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div>
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }} className="btn-cute inline-flex items-center gap-2" onClick={wish}>
            {lit ? <><Wand2 size={20} /> Make a Wish ✨</> : <><Flame size={20} /> Light them again 🕯️</>}
          </motion.button>
        </div>
        <a href="#gallery" className="mt-10 inline-block font-hand text-xl text-ink/60 bob no-underline">scroll down, there's more ↓</a>
      </div>
    </section>
  )
}
