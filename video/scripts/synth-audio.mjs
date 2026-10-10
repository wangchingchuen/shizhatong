// Procedurally synthesised sound design (no samples, no music library).
// Cue times come from src/timeline.ts, the same file the scenes use, so audio stays frame-synced.
// Output: out/audio/sfx.wav (48 kHz stereo 16-bit)
import {mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {SCENES, sceneStart, TOTAL_SEC, DIALOG} from '../src/timeline.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const SR = 48000;
const N = Math.ceil((TOTAL_SEC + 0.5) * SR);
const L = new Float32Array(N), R = new Float32Array(N);

let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const TAU = Math.PI * 2;

/** add a mono generator g(t) for duration d at time t0 */
const add = (t0, d, g, gain = 1, pan = 0) => {
  const a = Math.max(0, Math.floor(t0 * SR)), b = Math.min(N, Math.floor((t0 + d) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4) * Math.SQRT2, gr = gain * Math.sin((pan + 1) * Math.PI / 4) * Math.SQRT2;
  for (let i = a; i < b; i++) { const v = g((i - a) / SR); L[i] += v * gl; R[i] += v * gr; }
};
const env = (t, atk, dec) => (t < atk ? t / atk : Math.exp(-(t - atk) / dec));
// time-varying state-variable filter on noise
const svfNoise = (cut, q = 0.5, mode = 'bp') => {
  let lo = 0, bp = 0;
  return (t) => {
    const f = 2 * Math.sin(Math.PI * Math.min(0.45, cut(t) / SR));
    const x = rnd();
    lo += f * bp; const hi = x - lo - q * bp; bp += f * hi;
    return mode === 'bp' ? bp : mode === 'lp' ? lo : hi;
  };
};
const sweep = (f0, f1, d, shape = 'exp') => {
  let ph = 0;
  return (t) => {
    const k = Math.min(1, t / d);
    const f = shape === 'exp' ? f0 * Math.pow(f1 / f0, k) : f0 + (f1 - f0) * k;
    ph += TAU * f / SR; return Math.sin(ph);
  };
};

const SFX = {
  vibrate: (t0, {dur = 0.5, gain = 1} = {}) => add(t0, dur, (t) => {
    const buzz = Math.tanh(3 * Math.sin(TAU * 172 * t)) * (0.6 + 0.4 * Math.sin(TAU * 26 * t));
    return buzz * Math.min(1, t / 0.02, (dur - t) / 0.03);
  }, 0.22 * gain),
  slide: (t0, {gain = 1} = {}) => { const n = svfNoise((t) => 600 + t * 9000, 0.4); add(t0, 0.4, (t) => n(t) * Math.sin(Math.PI * t / 0.4), 0.35 * gain); },
  scan: (t0, {dur = 1.2, gain = 1} = {}) => {
    const n = svfNoise((t) => 1500 + 3000 * (t / dur), 0.2);
    add(t0, dur, (t) => n(t) * (0.55 + 0.45 * Math.sign(Math.sin(TAU * 30 * t))) * Math.min(1, t / 0.05, (dur - t) / 0.1), 0.16 * gain);
  },
  impact: (t0, {gain = 1} = {}) => {
    const s = sweep(70, 32, 0.9); const n = svfNoise(() => 3000, 0.6, 'lp');
    add(t0, 1.4, (t) => s(t) * env(t, 0.004, 0.45) + n(t) * env(t, 0.001, 0.03) * 0.8, 0.42 * gain);
  },
  pulse: (t0, {gain = 1} = {}) => add(t0, 1.6, (t) => (Math.sin(TAU * 220 * t) + 0.5 * Math.sin(TAU * 330 * t) + 0.3 * Math.sin(TAU * 440 * t)) * env(t, 0.03, 0.5), 0.12 * gain),
  type: (t0, {gain = 1} = {}) => { const n = svfNoise(() => 5000, 0.3, 'hp'); add(t0, 0.012, (t) => n(t) * env(t, 0.0005, 0.003), 0.18 * gain, rnd() * 0.3); },
  lock: (t0, {gain = 1} = {}) => {
    add(t0, 0.05, (t) => Math.sin(TAU * 1320 * t) * env(t, 0.002, 0.02), 0.2 * gain);
    add(t0 + 0.055, 0.12, (t) => Math.sin(TAU * 1980 * t) * env(t, 0.002, 0.04), 0.2 * gain);
  },
  lockWarn: (t0, {gain = 1} = {}) => {
    add(t0, 0.06, (t) => Math.sin(TAU * 880 * t) * env(t, 0.002, 0.025), 0.22 * gain);
    add(t0 + 0.065, 0.14, (t) => Math.sin(TAU * 660 * t) * env(t, 0.002, 0.05), 0.22 * gain);
  },
  alert: (t0, {gain = 1} = {}) => {
    for (let k = 0; k < 2; k++) for (const [o, f] of [[0, 740], [0.19, 554]]) {
      add(t0 + k * 0.42 + o, 0.2, (t) => (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t) + 0.15 * Math.sin(TAU * 3 * f * t)) * Math.min(1, t / 0.005, (0.2 - t) / 0.03), 0.18 * gain);
    }
  },
  click: (t0, {gain = 1} = {}) => { const n = svfNoise(() => 4000, 0.5); add(t0, 0.03, (t) => (n(t) + Math.sin(TAU * 2100 * t)) * env(t, 0.0005, 0.006), 0.3 * gain); },
  tick: (t0, {gain = 1} = {}) => add(t0, 0.03, (t) => Math.sin(TAU * 2400 * t) * env(t, 0.001, 0.008), 0.12 * gain, rnd() * 0.4),
  zero: (t0, {gain = 1} = {}) => { const s = sweep(1600, 380, 0.09); add(t0, 0.1, (t) => s(t) * env(t, 0.002, 0.04), 0.14 * gain); },
  powerup: (t0, {gain = 1} = {}) => { const s = sweep(180, 900, 0.45); const s2 = sweep(360, 1800, 0.45); add(t0, 0.7, (t) => (s(t) + 0.3 * s2(t)) * env(t, 0.05, 0.25), 0.16 * gain); },
  blip: (t0, {gain = 1, pan = 0} = {}) => add(t0, 0.12, (t) => Math.sin(TAU * 1040 * t) * env(t, 0.003, 0.03), 0.16 * gain, pan),
  whoosh: (t0, {dur = 0.9, gain = 1} = {}) => {
    const n = svfNoise((t) => 300 * Math.pow(14, Math.min(1, t / dur)), 0.35);
    const a = Math.floor(t0 * SR), b = Math.min(N, Math.floor((t0 + dur) * SR));
    for (let i = a; i < b; i++) {
      const t = (i - a) / SR, k = t / dur, v = n(t) * Math.sin(Math.PI * k) * 0.4 * gain, p = -0.7 + 1.4 * k;
      L[i] += v * Math.cos((p + 1) * Math.PI / 4) * Math.SQRT2; R[i] += v * Math.sin((p + 1) * Math.PI / 4) * Math.SQRT2;
    }
  },
  receive: (t0, {gain = 1} = {}) => {
    for (const [o, f] of [[0, 1318.5], [0.12, 1760]]) add(t0 + o, 1.2, (t) => (Math.sin(TAU * f * t) + 0.25 * Math.sin(TAU * 2.76 * f * t) * Math.exp(-t * 8)) * env(t, 0.002, 0.35), 0.17 * gain);
  },
  sweepDown: (t0, {dur = 2.0, gain = 1} = {}) => {
    const s = sweep(2400, 60, dur); const n = svfNoise((t) => 6000 * Math.pow(0.03, Math.min(1, t / dur)), 0.4);
    add(t0, dur, (t) => (s(t) * 0.8 + n(t) * 0.5) * Math.min(1, t / 0.05, (dur - t) / 0.2), 0.16 * gain);
  },
  dial: (t0, {gain = 1} = {}) => {
    const keys = [[697, 1209], [770, 1336], [852, 1477], [941, 1336]];
    keys.forEach(([a, b], k) => add(t0 + k * 0.13, 0.09, (t) => (Math.sin(TAU * a * t) + Math.sin(TAU * b * t)) * Math.min(1, t / 0.004, (0.09 - t) / 0.01), 0.07 * gain));
    add(t0 + 0.7, 1.0, (t) => Math.sin(TAU * 440 * t) * (0.5 + 0.5 * Math.sin(TAU * 20 * t)) * Math.min(1, t / 0.02, (1 - t) / 0.05), 0.06 * gain);
  },
  hangup: (t0, {gain = 1} = {}) => {
    SFX.click(t0, {gain});
    for (let k = 0; k < 2; k++) add(t0 + 0.12 + k * 0.18, 0.12, (t) => Math.sin(TAU * 480 * t) * Math.min(1, t / 0.005, (0.12 - t) / 0.01), 0.08 * gain);
  },
  ring: (t0, {dur = 1.6, gain = 1} = {}) => {
    const notes = [659.25, 830.6, 987.8, 830.6];
    for (let k = 0; k * 0.16 < dur; k++) {
      const f = notes[k % 4];
      add(t0 + k * 0.16, 0.5, (t) => (Math.sin(TAU * f * t) + 0.2 * Math.sin(TAU * 4 * f * t) * Math.exp(-t * 30)) * env(t, 0.002, 0.12), 0.1 * gain);
    }
  },
  pad: (t0, {dur = 11, gain = 1} = {}) => {
    const chord = [110, 164.8, 220, 277.2, 329.6, 440];
    let lp = 0;
    add(t0, dur, (t) => {
      let v = 0;
      chord.forEach((f, i) => { const det = 1 + 0.002 * Math.sin(t * 0.3 + i); v += ((t * f * det) % 1) * 2 - 1; });
      lp += 0.02 * (v / chord.length - lp);
      return lp * Math.min(1, t / 3, (dur - t) / 2.5);
    }, 0.5 * gain);
  },
};

// heartbeat under the three dialogue beats, accelerating (64 → 122 bpm)
const d0 = sceneStart.dialog;
for (let t = 0.3; t < 21.6;) {
  const bpm = 64 + (t / 22) * 58;
  for (const [o, f, g] of [[0, 62, 1], [0.16, 50, 0.7]]) add(d0 + t + o, 0.35, (x) => Math.sin(TAU * f * x * (1 - x * 0.8)) * env(x, 0.006, 0.07), 0.3 * g);
  t += 60 / bpm;
}

// low-frequency bed for the whole film (fades for dawn / end)
{
  const n = svfNoise(() => 110, 0.6, 'lp');
  const dawn = sceneStart.dawn, end = TOTAL_SEC;
  add(0, end, (t) => {
    const fade = Math.min(1, t / 2, (end - t) / 2) * (t > dawn ? Math.max(0.35, 1 - (t - dawn) / 6) : 1);
    return (n(t) * 1.6 + 0.5 * Math.sin(TAU * 41 * t) * (0.7 + 0.3 * Math.sin(TAU * 0.1 * t))) * fade;
  }, 0.07);
}

// per-effect trim so small UI sounds sit above the bed
const TRIM = {lock: 1.6, lockWarn: 1.6, tick: 1.6, blip: 1.5, zero: 1.5, type: 1.4, click: 1.3, receive: 1.4, powerup: 1.4, scan: 1.4, pulse: 1.4};
for (const s of SCENES) for (const [t, name, opts] of s.cues) SFX[name](sceneStart[s.id] + t, {...opts, gain: (opts?.gain ?? 1) * (TRIM[name] ?? 1)});

// hard-cut accent at each 'cut' boundary
for (const s of SCENES.slice(1)) if (s.enter === 'cut') add(sceneStart[s.id], 0.25, (t) => Math.sin(TAU * 48 * t) * env(t, 0.002, 0.08), 0.35);

// peak-normalise to -1 dBFS and write
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const norm = peak > 0 ? 0.89 / peak : 1;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), 46 + i * 4);
}
const out = path.resolve(here, '../out/audio');
mkdirSync(out, {recursive: true});
writeFileSync(`${out}/sfx.wav`, buf);
console.log('sfx.wav', (N / SR).toFixed(1), 's, peak', peak.toFixed(2));
