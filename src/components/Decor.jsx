import { useMemo, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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

/** Slowly rising decorative items. `parallax` drifts the whole layer as you scroll. */
export function FloatingItems({ kinds = ['heart'], count = 12, className = '', parallax = 0 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax])
  const items = useMemo(() => Array.from({ length: count }, (_, i) => {
    const kind = kinds[i % kinds.length]
    const color = PALETTE[(Math.random() * PALETTE.length) | 0]
    return { i, left: rnd(2, 96), dur: rnd(12, 24), delay: -rnd(0, 24), dx: rnd(-50, 50), rot: rnd(-40, 40), el: renderItem(kind, color) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [count])
  return (
    <motion.div ref={ref} style={parallax ? { y } : undefined} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map(it => (
        <span key={it.i} className="float-up" style={{ left: `${it.left}%`, animationDuration: `${it.dur}s`, animationDelay: `${it.delay}s`, '--dx': `${it.dx}px`, '--rot': `${it.rot}deg` }}>{it.el}</span>
      ))}
    </motion.div>
  )
}

const DOODLES = {
  squiggle: (s, c) => <svg width={s} height={s * .4} viewBox="0 0 60 24" fill="none"><path d="M3 15 Q 12 3, 21 15 T 39 15 T 57 15" stroke={c} strokeWidth="3" strokeLinecap="round" /></svg>,
  arrow: (s, c) => <svg width={s} height={s} viewBox="0 0 40 40" fill="none"><path d="M6 34 C 16 8, 30 6, 32 18 M32 18 l-6-1 M32 18 l-1 7" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  heart: (s, c) => <svg width={s} height={s} viewBox="0 0 40 40" fill="none"><path d="M20 33 C6 22 4 10 13 8 c5-1 7 3 7 3 s2-4 7-3 c9 2 7 14 -7 25z" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  star: (s, c) => <svg width={s} height={s} viewBox="0 0 40 40" fill="none"><path d="M20 5 l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" stroke={c} strokeWidth="3" strokeLinejoin="round" /></svg>,
  flower: (s, c) => <svg width={s} height={s} viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="5" stroke={c} strokeWidth="3" /><path d="M20 8 v5 M20 27 v5 M8 20 h5 M27 20 h5 M11.5 11.5 l3.5 3.5 M25 25 l3.5 3.5 M28.5 11.5 L25 15 M15 25 l-3.5 3.5" stroke={c} strokeWidth="3" strokeLinecap="round" /></svg>,
  xoxo: (s, c) => <span className="font-hand" style={{ fontSize: s, color: c }}>xoxo</span>,
  spark: (s, c) => <svg width={s} height={s} viewBox="0 0 40 40" fill="none"><path d="M20 4 v9 M20 27 v9 M4 20 h9 M27 20 h9 M9 9 l6 6 M25 25 l6 6 M31 9 l-6 6 M15 25 l-6 6" stroke={c} strokeWidth="3" strokeLinecap="round" /></svg>,
}
const DOODLE_COLORS = ['#e8a4bd', '#c4a8ec', '#e8b69b', '#d9a38f']

/** Hand-drawn scrapbook doodles scattered in the whitespace. items: [type, className][] */
export function Doodles({ items }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map(([type, cls], i) => {
        const c = DOODLE_COLORS[i % DOODLE_COLORS.length]
        const s = 36 + (i % 3) * 12
        return <span key={i} className={`absolute opacity-50 ${i % 2 ? 'twinkle' : 'wiggle'} ${cls}`}>{DOODLES[type]?.(s, c)}</span>
      })}
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
