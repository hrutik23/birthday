import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Loader from './components/Loader'
import GiftScreen from './components/GiftScreen'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Reasons from './components/Reasons'
import Letter from './components/Letter'
import Finale from './components/Finale'
import { ComplimentButton, CursorSparkles, MusicToggle, ProgressBar } from './components/Widgets'
import { initSmoothScroll } from './lib/smoothScroll'

const SECTIONS = ['hero', 'gallery', 'reasons', 'letter', 'finale']

export default function App() {
  const [loading, setLoading] = useState(true)
  const [opened, setOpened] = useState(false)

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1700); return () => clearTimeout(t) }, [])
  useEffect(() => { if (opened) return initSmoothScroll() }, [opened])
  useEffect(() => { document.body.classList.toggle('locked', !opened); if (opened) scrollTo(0, 0) }, [opened])

  return (
    <>
      <CursorSparkles />
      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>
      <AnimatePresence>{!loading && !opened && <GiftScreen key="gift" onOpened={() => setOpened(true)} />}</AnimatePresence>
      {opened && (
        <>
          <ProgressBar ids={SECTIONS} />
          <MusicToggle />
          <ComplimentButton />
          <main>
            <Hero active />
            <Gallery />
            <Reasons />
            <Letter />
            <Finale />
          </main>
        </>
      )}
    </>
  )
}
