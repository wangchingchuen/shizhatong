import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './timeline';

export const ramp = (frame: number, [a, b]: [number, number], [x, y]: [number, number] = [0, 1], ease = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [a, b], [x, y], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const spr = (frame: number, delaySec = 0, cfg: {damping?: number; stiffness?: number; mass?: number} = {}) =>
  spring({frame: frame - Math.round(delaySec * FPS), fps: FPS, config: {damping: 14, stiffness: 120, mass: 0.8, ...cfg}});

export const sec = (frame: number) => frame / FPS;

/** number of characters visible for a typewriter that starts at `startSec`. */
export const typedCount = (frame: number, startSec: number, charSec: number, len: number) =>
  Math.max(0, Math.min(len, Math.floor((frame / FPS - startSec) / charSec) + 1));

/** deterministic pseudo-random in [0,1) */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
