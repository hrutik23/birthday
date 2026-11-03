import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function Loader() {
  return (
    <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-gradient-to-b from-[#fff0f6] to-[#f3e8ff]" exit={{ opacity: 0 }} transition={{ duration: .6 }}>
      <div className="text-center">
        <div className="pulse-heart inline-block"><Heart size={64} fill="#ff8fb7" color="#ff8fb7" /></div>
        <p className="mt-4 font-hand text-3xl text-ink">wrapping your surprise...</p>
        <div className="mx-auto mt-4 h-2 w-40 overflow-hidden rounded-full bg-white/70">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-rosy to-peach" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.5, ease: 'easeInOut' }} />
        </div>
      </div>
    </motion.div>
  )
}
