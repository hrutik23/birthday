import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Star, Flower2 } from 'lucide-react'

const rnd = (a, b) => a + Math.random() * (b - a)
const PALETTE = ['#ff8fb7', '#ffb3cf', '#c9a8ff', '#ffc3a0', '#ffe27a', '#d9a38f']

export const Balloon = ({ color = '#ff8fb7', size = 46 }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 40 60" aria-hidden="true">
    <ellipse cx="20" cy="20" rx="16" ry="19" fill={color} />
    <ellipse cx="13" cy="12" rx="4" ry="6" fill="#fff" opacity=".45" transform="rotate(25 13 12)" />
    <path d="M20 39 l-3 4 h6z" fill={color} />
    <path d="M20 43 q-6 8 0 16" stroke="#d9a38f" strokeWidth="1.2" fill="none" />
  </svg>
)

export const Butterfly = ({ color = '#c9a8ff', size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ animation: 'flutter .5s ease-in-out infinite' }}>
    <path d="M20 20 C10 2 0 8 4 18 C6 24 14 24 20 20Z" fill={color} />
    <path d="M20 20 C30 2 40 8 36 18 C34 24 26 24 20 20Z" fill={color} />
    <path d="M20 20 C12 22 8 34 14 34 C18 34 20 26 20 20Z" fill="#ffb3cf" />
    <path d="M20 20 C28 22 32 34 26 34 C22 34 20 26 20 20Z" fill="#ffb3cf" />
    <rect x="19" y="12" width="2" height="18" rx="1" fill="#8a6478" />
  </svg>
)

const renderItem = (kind, color) => {
  if (kind === 'heart') return <Heart size={rnd(14, 30)} fill={color} color={color} />
  if (kind === 'star') return <Star size={rnd(12, 22)} fill={color} color={color} />
  if (kind === 'sparkle') return <Sparkles size={rnd(14, 24)} color={color} />
  if (kind === 'flower') return <Flower2 size={rnd(16, 28)} color={color} />
  if (kind === 'balloon') return <Balloon color={color} size={rnd(30, 44)} />
  return <Butterfly color={color} size={rnd(22, 32)} />
}

/** Slowly rising decorative items. Pure CSS animation for performance. */
export function FloatingItems({ kinds = ['heart'], count = 12, className = '' }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => {
    const kind = kinds[i % kinds.length]
    const color = PALETTE[(Math.random() * PALETTE.length) | 0]
    return { i, left: rnd(2, 96), dur: rnd(12, 24), delay: -rnd(0, 24), dx: rnd(-50, 50), rot: rnd(-40, 40), el: renderItem(kind, color) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [count])
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map(it => (
        <span key={it.i} className="float-up" style={{ left: `${it.left}%`, animationDuration: `${it.dur}s`, animationDelay: `${it.delay}s`, '--dx': `${it.dx}px`, '--rot': `${it.rot}deg` }}>{it.el}</span>
      ))}
    </div>
  )
}

/** Scroll-triggered reveal wrapper. */
export const Reveal = ({ children, delay = 0, y = 30, className = '', as = 'div' }) => {
  const M = motion[as]
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: .7, delay, ease: 'easeOut' }}>
      {children}
    </M>
  )
}

export const SectionTitle = ({ emoji, children, sub }) => (
  <Reveal className="mb-10 text-center">
    <div className="text-4xl bob mb-2" aria-hidden="true">{emoji}</div>
    <h2 className="title-script text-3xl sm:text-5xl leading-snug px-2">{children}</h2>
    {sub && <p className="mt-3 font-hand text-2xl text-ink/70">{sub}</p>}
  </Reveal>
)

export const Wave = ({ fill = '#fff', flip = false }) => (
  <svg className={`absolute left-0 w-full h-10 sm:h-16 ${flip ? 'bottom-0 rotate-180' : 'top-0'}`} viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 0h1440v30c-120 40-240 50-360 30S840 0 720 10 480 70 360 70 120 50 0 30z" fill={fill} opacity=".0" />
    <path d="M0 80V40c120 30 240 40 360 20s240-50 360-40 240 40 360 40 240-30 360-50v70z" fill={fill} />
  </svg>
)
