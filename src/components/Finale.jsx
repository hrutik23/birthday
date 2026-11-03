import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PartyPopper } from 'lucide-react'
import { config } from '../config'
import { burst, fireworks, rain } from '../lib/confetti'
import { FloatingItems } from './Decor'

export default function Finale() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: .5 })
  const celebrate = () => { fireworks(7); burst({ x: innerWidth / 2, y: innerHeight * .6, count: 120, power: 14 }); rain(2500) }
  useEffect(() => { if (inView) celebrate() }, [inView])

  return (
    <section ref={ref} id="finale" data-section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 text-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#ffd6e5]/70 to-[#e3d4ff]/80" />
      <FloatingItems kinds={['heart', 'sparkle', 'star', 'heart', 'butterfly']} count={22} />
      <div className="relative z-10 max-w-xl">
        <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', bounce: .5 }} className="mb-4 text-6xl bob">🎉</motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8 }} className="title-script text-4xl leading-snug sm:text-6xl">{config.finale.title}</motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: .5 }} className="mt-5 font-hand text-3xl text-ink sm:text-4xl">{config.finale.subtitle}</motion.p>
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }} onClick={celebrate} className="btn-cute mt-10 inline-flex items-center gap-2"><PartyPopper size={20} /> {config.finale.button}</motion.button>
        <p className="mt-12 text-sm text-ink/50">made with all my love 💗</p>
      </div>
    </section>
  )
}
