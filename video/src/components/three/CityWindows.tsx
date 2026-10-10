import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {hash} from '../../anim';
import {glowTexture} from './textures';

export const FACADE = {cols: 44, rows: 26, sx: 1.3, sy: 1.75, ww: 0.82, wh: 1.12};
/** World position of a window centre on the facade (z = 0 plane). */
export const windowPos = (col: number, row: number): [number, number, number] => [
  (col - (FACADE.cols - 1) / 2) * FACADE.sx,
  (row - (FACADE.rows - 1) / 2) * FACADE.sy,
  0.02,
];
export const GRANDMA: [number, number] = [19, 10];
export const DAUGHTER: [number, number] = [36, 16];

const NIGHT_LIT = new THREE.Color('#e9dfb8');
const NIGHT_LIME = new THREE.Color('#dceda5');
const DARK = new THREE.Color('#0f211b');
const DAWN_GLASS = new THREE.Color('#5d6f6a');

/**
 * Apartment facade made of window panes (instanced).
 * dawn 0..1 turns lights off progressively and windows into morning-sky reflections.
 * highlight: windows that stay lit and get a soft directional glow.
 */
export const CityWindows: React.FC<{frame: number; dawn?: number; highlight?: [number, number][]; highlightColor?: string; flicker?: boolean}> = ({frame, dawn = 0, highlight = [], highlightColor = '#f1e3b5', flicker = true}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const n = FACADE.cols * FACADE.rows;
  const seeds = useMemo(() => Array.from({length: n}, (_, i) => ({lit: hash(i) < 0.46, lime: hash(i + 999) < 0.06, off: hash(i + 77), bright: 0.45 + 0.55 * hash(i + 5)})), [n]);
  const isHi = (c: number, r: number) => highlight.some(([hc, hr]) => hc === c && hr === r);
  const hiColor = useMemo(() => new THREE.Color(highlightColor), [highlightColor]);

  useLayoutEffect(() => {
    const m = ref.current!;
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    for (let r = 0, i = 0; r < FACADE.rows; r++) for (let c = 0; c < FACADE.cols; c++, i++) {
      o.position.set(...windowPos(c, r));
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      const s = seeds[i];
      const hi = isHi(c, r);
      // dawn: each light switches off at its own moment
      const on = hi ? 1 : s.lit && dawn < 0.15 + s.off * 0.75 ? 1 : 0;
      const fl = flicker && !hi && s.off > 0.97 ? 0.6 + 0.4 * Math.sin(frame * 0.7 + i) : 1;
      if (hi) col.copy(hiColor);
      else if (on) col.copy(s.lime ? NIGHT_LIME : NIGHT_LIT).multiplyScalar(s.bright * fl * 0.85);
      else col.copy(DARK).lerp(DAWN_GLASS, dawn * (0.5 + 0.5 * s.bright));
      m.setColorAt(i, col);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      {/* wall */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[FACADE.cols * FACADE.sx + 2, FACADE.rows * FACADE.sy + 2]} />
        <meshBasicMaterial color={new THREE.Color('#081410').lerp(new THREE.Color('#2a3a35'), dawn * 0.8)} />
      </mesh>
      {/* floor slabs */}
      {Array.from({length: FACADE.rows + 1}, (_, r) => (
        <mesh key={r} position={[0, (r - FACADE.rows / 2) * FACADE.sy, 0.04]}>
          <planeGeometry args={[FACADE.cols * FACADE.sx + 2, 0.06]} />
          <meshBasicMaterial color="#1c3029" />
        </mesh>
      ))}
      <instancedMesh ref={ref} args={[undefined, undefined, n]}>
        <planeGeometry args={[FACADE.ww, FACADE.wh]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {highlight.map(([c, r], i) => {
        const p = windowPos(c, r);
        return (
          <mesh key={i} position={[p[0], p[1] - 0.15, 0.1]}>
            <planeGeometry args={[4.2, 4.2]} />
            <meshBasicMaterial map={glowTexture('rgba(241,227,181,0.55)')} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};
