// Lightweight lerp smooth-scroll for mouse wheels. Touch and keyboard keep
// native behaviour; real scroll position is used so observers/fixed UI work.
export function initSmoothScroll() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  if (!matchMedia('(pointer: fine)').matches) return () => {}

  let target = window.scrollY
  let current = window.scrollY
  let raf = 0

  const max = () => document.documentElement.scrollHeight - innerHeight

  const tick = () => {
    current += (target - current) * 0.12
    if (Math.abs(target - current) < 0.5) { window.scrollTo(0, target); raf = 0; return }
    window.scrollTo(0, current)
    raf = requestAnimationFrame(tick)
  }

  const onWheel = (e) => {
    if (e.ctrlKey) return // keep pinch/ctrl zoom
    const mode = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? innerHeight : 1
    const next = Math.min(Math.max(target + e.deltaY * mode, 0), max())
    if (next === target && !raf) return
    e.preventDefault()
    target = next
    if (!raf) { current = window.scrollY; raf = requestAnimationFrame(tick) }
  }

  // If something else moved the page (keyboard, scrollbar, anchors), resync.
  const onScroll = () => { if (!raf) { target = current = window.scrollY } }

  addEventListener('wheel', onWheel, { passive: false })
  addEventListener('scroll', onScroll, { passive: true })
  return () => {
    removeEventListener('wheel', onWheel)
    removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
  }
}
