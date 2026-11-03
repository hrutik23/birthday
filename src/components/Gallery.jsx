import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react'
import { config } from '../config'
import { Doodles, Reveal, SectionTitle } from './Decor'

const TILTS = [-4, 3, -2, 5, -5, 2, -3, 4]

function Photo({ src, alt, className = '' }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div className={`grid place-items-center bg-gradient-to-br from-blush to-lilac ${className}`}><Heart size={40} fill="#fff" color="#fff" /></div>
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={`object-cover ${className}`} draggable="false" />
}

function Lightbox({ index, onClose, onNav }) {
  const item = config.gallery[index]
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onNav(1); if (e.key === 'ArrowLeft') onNav(-1) }
    addEventListener('keydown', onKey)
    document.body.classList.add('locked')
    return () => { removeEventListener('keydown', onKey); document.body.classList.remove('locked') }
  }, [onClose, onNav])

  return (
    <motion.div className="fixed inset-0 z-[85] flex items-center justify-center bg-[#6b4a5e]/70 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-label="Photo viewer">
      <button aria-label="Close" onClick={onClose} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-ink shadow-lg"><X /></button>
      <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); onNav(-1) }} className="absolute left-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-ink shadow-lg sm:left-6"><ChevronLeft /></button>
      <button aria-label="Next" onClick={(e) => { e.stopPropagation(); onNav(1) }} className="absolute right-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-ink shadow-lg sm:right-6"><ChevronRight /></button>
      <AnimatePresence mode="wait">
        <motion.figure key={index} onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: .85, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: .9 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="max-h-full w-full max-w-md rounded-md bg-white p-3 pb-5 shadow-2xl">
          <Photo src={item.src} alt={item.caption} className="max-h-[65vh] w-full rounded-sm" />
          <figcaption className="mt-4 text-center font-hand text-3xl text-ink">{item.caption}</figcaption>
          <p className="text-center text-xs text-ink/40">{index + 1} / {config.gallery.length}</p>
        </motion.figure>
      </AnimatePresence>
    </motion.div>
  )
}

export default function Gallery() {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const nav = useCallback((d) => setOpen(i => (i + d + config.gallery.length) % config.gallery.length), [])

  return (
    <section id="gallery" data-section className="relative overflow-hidden px-4 py-24 sm:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-lilac/40 to-transparent" />
      <Doodles items={[
        ['flower', 'top-20 left-[4%] rotate-6 hidden sm:block'],
        ['spark', 'top-32 right-[5%] -rotate-6'],
        ['squiggle', 'bottom-24 left-[5%] -rotate-6 hidden sm:block'],
        ['heart', 'bottom-40 right-[6%] rotate-12'],
      ]} />
      <SectionTitle emoji="📸" sub="tap a polaroid to peek closer">A Little Gallery of Us</SectionTitle>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4">
        {config.gallery.map((g, i) => (
          <Reveal key={i} delay={(i % 4) * .08} className="flex justify-center">
            <motion.button onClick={() => setOpen(i)} initial={{ rotate: TILTS[i % 8] }} whileHover={{ rotate: 0, scale: 1.08, y: -6 }} whileTap={{ scale: .96 }}
              className="relative w-full max-w-[220px] cursor-pointer rounded-md border-0 bg-white p-2 pb-3 shadow-[0_10px_25px_rgba(217,163,143,.35)]" aria-label={`Open photo: ${g.caption}`}>
              <span className="absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 -rotate-3 bg-butter/80 shadow-sm" style={{ backgroundColor: i % 2 ? 'rgba(255,179,207,.75)' : 'rgba(255,242,179,.85)' }} />
              <Photo src={g.src} alt={g.caption} className="aspect-[4/5] w-full rounded-sm" />
              <span className="mt-2 block px-1 text-center font-hand text-lg leading-tight text-ink sm:text-xl">{g.caption}</span>
            </motion.button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onNav={nav} />}</AnimatePresence>
    </section>
  )
}
