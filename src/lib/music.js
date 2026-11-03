// "Happy Birthday" synthesised with the Web Audio API – no audio file needed.
const F = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 }
const SONG = [
  ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2],
]
let ac, timer, playing = false

const play = () => {
  const beat = .42
  let t = ac.currentTime + .05
  const master = ac.createGain()
  master.gain.value = .12
  master.connect(ac.destination)
  for (const [n, d] of SONG) {
    const o = ac.createOscillator(), g = ac.createGain()
    o.type = 'triangle'; o.frequency.value = F[n]
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(1, t + .03)
    g.gain.exponentialRampToValueAtTime(.001, t + d * beat)
    o.connect(g); g.connect(master); o.start(t); o.stop(t + d * beat + .05)
    t += d * beat
  }
  timer = setTimeout(() => playing && play(), (t - ac.currentTime + 1.2) * 1000)
}

export const toggleMusic = () => {
  if (!playing) {
    ac = new (window.AudioContext || window.webkitAudioContext)()
    ac.resume(); playing = true; play()
  } else {
    playing = false; clearTimeout(timer); ac?.close(); ac = null
  }
  return playing
}
