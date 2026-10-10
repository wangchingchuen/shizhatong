import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {ramp} from '../anim';
import {C} from '../theme';
import {useLayout} from '../layout';
import {CameraRig} from '../components/three/CameraRig';
import {CityWindows, DAUGHTER, GRANDMA, windowPos} from '../components/three/CityWindows';
import {SignalArc} from '../components/three/SignalArc';
import {MonoLabel} from '../components/MonoLabel';

const skyTexture = () => {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 256;
  const g = c.getContext('2d')!;
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, '#30474a'); grd.addColorStop(0.55, '#8b8a78'); grd.addColorStop(0.85, '#f2c48d'); grd.addColorStop(1, '#f6d7aa');
  g.fillStyle = grd; g.fillRect(0, 0, 4, 256);
  return new THREE.CanvasTexture(c);
};

/** 句20–21 — night turns to dawn: window lights go out one by one, morning light arrives; a warm line stays between the two phones. */
export const Dawn: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const dawn = ramp(frame, [0.5 * 30, 9.5 * 30], [0, 1], (x) => x * x * (3 - 2 * x));
  const g = windowPos(...GRANDMA), d = windowPos(...DAUGHTER);
  const k = ramp(frame, [0, 330], [0, 1], (x) => x);
  const pos: [number, number, number] = V ? [6, -4 + k * 4, 70 + k * 40] : [6, -4 + k * 6, 42 + k * 34];
  const look: [number, number, number] = [7, 4 + k * 6, 0];
  const sky = useMemo(skyTexture, []);
  const hh = Math.floor(5 + dawn * 1), mm = Math.floor((dawn * 50) % 60);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <ThreeCanvas width={W} height={H} style={{position: 'absolute'}}>
        <color attach="background" args={['#050c0a']} />
        <CameraRig pos={pos} look={look} fov={V ? 62 : 42} />
        <mesh position={[0, 40, -80]}><planeGeometry args={[600, 260]} /><meshBasicMaterial map={sky} transparent opacity={dawn} toneMapped={false} /></mesh>
        <CityWindows frame={frame} dawn={dawn} highlight={[GRANDMA, DAUGHTER]} highlightColor={new THREE.Color('#f1e3b5').lerp(new THREE.Color('#f2c48d'), dawn).getStyle()} flicker={false} />
        <group position={[-70, -8, -25]}><CityWindows frame={frame + 40} dawn={dawn} flicker={false} /></group>
        <group position={[72, 6, -30]}><CityWindows frame={frame + 80} dawn={dawn} flicker={false} /></group>
        <SignalArc a={g} b={d} progress={ramp(frame, [0.2 * 30, 1.6 * 30])} color={new THREE.Color('#dceda5').lerp(new THREE.Color('#f2c48d'), Math.min(1, dawn * 2)).getStyle()} head={false} radius={0.1} />
      </ThreeCanvas>
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(242,196,141,${dawn * 0.10}) 0%, transparent 60%)`}} />
      <div style={{position: 'absolute', left: W * (V ? 0.06 : 0.045), top: H * 0.12}}>
        <MonoLabel size={20} color={dawn > 0.5 ? C.dawn : C.limeDim}>{t < 1 ? '21:42' : `0${hh}:${String(mm).padStart(2, '0')}`} · {dawn > 0.5 ? 'MORNING' : 'NIGHT'}</MonoLabel>
      </div>
    </AbsoluteFill>
  );
};
