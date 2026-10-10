import * as THREE from 'three';

const cache = new Map<string, THREE.Texture>();
/** Soft radial glow sprite (used only behind screens / lit windows / lock frames). */
export const glowTexture = (inner = 'rgba(255,255,255,1)') => {
  const k = 'glow' + inner;
  if (cache.has(k)) return cache.get(k)!;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.35, inner.replace(/[\d.]+\)$/, '0.35)'));
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  cache.set(k, t);
  return t;
};

/** Incoming-call screen drawn to a canvas (no text: avatar, caller bars, answer slider). */
export const callScreenTexture = () => {
  const k = 'callscreen';
  if (cache.has(k)) return cache.get(k)!;
  const c = document.createElement('canvas');
  c.width = 128; c.height = 276;
  const g = c.getContext('2d')!;
  const grd = g.createLinearGradient(0, 0, 0, 276);
  grd.addColorStop(0, '#cfe3b0'); grd.addColorStop(1, '#6f8f6a');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 276);
  g.fillStyle = 'rgba(11,28,23,0.75)';
  g.beginPath(); g.arc(64, 70, 22, 0, Math.PI * 2); g.fill();
  g.fillRect(30, 108, 68, 10); g.fillRect(40, 126, 48, 7);
  g.fillStyle = 'rgba(11,28,23,0.35)'; g.fillRect(18, 220, 92, 26);
  g.fillStyle = 'rgba(11,28,23,0.85)'; g.beginPath(); g.arc(32, 233, 10, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c);
  cache.set(k, t);
  return t;
};
