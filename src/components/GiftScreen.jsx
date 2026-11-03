import { useState } from 'react'
import { motion } from 'framer-motion'
import { config } from '../config'
import { burst, rain } from '../lib/confetti'
import { FloatingItems } from './Decor'

function GiftBox({ open }) {
  return (
    <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64" aria-hidden="true">
      <div className="absolute inset-x-0 bottom-0 top-0 grid place-items-end">
        <motion.div animate={open ? { scale: [1, 1.04, 1] } : { rotate: [-2, 2, -2] }} transition={open ? { duration: .5 } : { duration: 2, repeat: Infinity }} className="relative h-40 w-44 sm:h-44 sm:w-48 origin-bottom">
          {/* inside glow */}
          <motion.div className="absolute -top-10 left-1/2 h-20 w-32 -translate-x-1/2 rounded-full bg-butter blur-2xl" animate={{ opacity: open ? 1 : 0 }} />
          {/* box body */}
          <div className="absolute inset-0 rounded-b-3xl rounded-t-md bg-gradient-to-b from-[#ffb3cf] to-[#ff8fb7] shadow-[0_18px_30px_rgba(255,143,183,.45)]" />
          <div className="absolute inset-y-0 left-1/2 w-9 -translate-x-1/2 bg-gradient-to-b from-[#fff2b3] to-[#ffe27a]" />
          {/* dots */}
          {[[14, 30], [20, 70], [78, 40], [74, 80], [30, 105]].map(([l, t], i) => <span key={i} className="absolute h-3 w-3 rounded-full bg-white/60" style={{ left: `${l}%`, top: t }} />)}
        </motion.div>
        {/* lid */}
        <motion.div className="absolute left-1/2 top-[22%] h-12 w-52 origin-bottom-left" style={{ marginLeft: '-6.5rem' }}
          animate={open ? { y: -90, rotate: -28, x: -30, opacity: 0 } : { y: 0, rotate: 0 }} transition={{ duration: .9, ease: 'easeInOut' }}>
          <div className="relative h-full w-full rounded-xl bg-gradient-to-b from-[#ffc6dc] to-[#ff9ec4] shadow-md">
            <div className="absolute inset-y-0 left-1/2 w-9 -translate-x-1/2 bg-gradient-to-b from-[#fff2b3] to-[#ffe27a]" />
            {/* bow */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              <div className="relative h-9 w-20">
                <span className="absolute left-0 top-0 h-9 w-9 -rotate-12 rounded-full border-[7px] border-[#ffe27a] rounded-br-none" />
                <span className="absolute right-0 top-0 h-9 w-9 rotate-12 rounded-full border-[7px] border-[#ffe27a] rounded-bl-none" />
                <span className="absolute left-1/2 top-3 h-5 w-5 -translate-x-1/2 rounded-full bg-[#ffd24d]" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function GiftScreen({ onOpened }) {
  const [open, setOpen] = useState(false)

  const handleOpen = (e) => {
    if (open) return
    setOpen(true)
    setTimeout(() => { burst({ x: innerWidth / 2, y: innerHeight * .45, count: 140, power: 15 }); rain(2200) }, 450)
    setTimeout(onOpened, 2100)
  }

  return (
    <motion.div className="fixed inset-0 z-[80] overflow-y-auto bg-gradient-to-b from-[#ffe3ee] via-[#f3e8ff] to-[#fff3e6]" exit={{ opacity: 0, scale: 1.08 }} transition={{ duration: .8 }}>
      <FloatingItems kinds={['heart', 'star', 'sparkle', 'butterfly']} count={14} />
      <div className="relative flex min-h-full flex-col items-center justify-center px-6 py-10 text-center">
        <motion.div animate={open ? { opacity: 0, y: -20 } : { opacity: 1 }} className="space-y-3">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }} className="title-script text-3xl sm:text-5xl leading-snug max-w-xl">{config.welcome.title}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }} className="font-hand text-2xl sm:text-3xl text-ink/80">{config.welcome.subtitle}</motion.p>
        </motion.div>
        <div className="my-10 cursor-pointer" onClick={handleOpen}><GiftBox open={open} /></div>
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }} className="btn-cute pulse-heart" onClick={handleOpen} disabled={open} style={{ opacity: open ? 0 : 1, transition: 'opacity .3s' }}>
          {config.welcome.button}
        </motion.button>
      </div>
    </motion.div>
  )
}
