import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PartyPopper } from 'lucide-react'
import { config } from '../config'
import { burst, fireworks, rain } from '../lib/confetti'
import { Doodles, FloatingItems } from './Decor'

function BounceTitle({ text }) {
  const words = text.split(' ')
  let key = 0
  return (
    <h2 className="title-script text-4xl leading-snug sm:text-6xl" aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {Array.from(w).map(ch => (
            <motion.span key={key++} className="inline-block"
              initial={{ opacity: 0, y: 40, scale: 0, rotate: -15 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: .55, delay: .15 + key * .045, duration: .7 }}>
              {ch}
            </motion.span>
          ))}
          <span>&nbsp;</span>
        </span>
      ))}
    </h2>
  )
}

export default function Finale() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: .5 })
  const celebrate = () => { fireworks(7); burst({ x: innerWidth / 2, y: innerHeight * .6, count: 120, power: 14 }); rain(2500) }
  useEffect(() => { if (inView) celebrate() }, [inView])

  return (
    <section ref={ref} id="finale" data-section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 text-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#ffd6e5]/70 to-[#e3d4ff]/80" />
      <FloatingItems kinds={['heart', 'sparkle', 'star', 'heart', 'butterfly']} count={22} parallax={60} />
      <Doodles items={[
        ['spark', 'top-20 left-[8%] rotate-6'],
        ['heart', 'top-28 right-[8%] -rotate-12'],
        ['squiggle', 'bottom-28 left-[10%] rotate-3 hidden sm:block'],
        ['flower', 'bottom-36 right-[9%] rotate-12 hidden sm:block'],
        ['xoxo', 'top-1/2 left-[5%] rotate-6'],
      ]} />
      <div className="relative z-10 max-w-xl">
        <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', bounce: .5 }} className="mb-4 text-6xl bob">🎉</motion.div>
        <BounceTitle text={config.finale.title} />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.4 }} className="mt-5 font-hand text-3xl text-ink sm:text-4xl">{config.finale.subtitle}</motion.p>
        <motion.button initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.8 }} whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }} onClick={celebrate} className="btn-cute mt-10 inline-flex items-center gap-2"><PartyPopper size={20} /> {config.finale.button}</motion.button>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2.1 }} className="mt-12 text-sm text-ink/50">made with all my love 💗</motion.p>
      </div>
    </section>
  )
}
