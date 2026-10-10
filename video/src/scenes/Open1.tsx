import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {ramp} from '../anim';
import {C} from '../theme';
import {useLayout} from '../layout';
import {CameraRig} from '../components/three/CameraRig';
import {CityWindows, GRANDMA, windowPos} from '../components/three/CityWindows';
import {LivingRoom} from '../components/three/LivingRoom';
import {DepthBlur} from '../components/DepthBlur';
import {MonoLabel} from '../components/MonoLabel';

const lerp3 = (a: number[], b: number[], k: number) => a.map((v, i) => v + (b[i] - v) * k) as [number, number, number];
export const buzz = (t: number, windows: [number, number][]) => {
  for (const [a, d] of windows) if (t >= a && t < a + d) return Math.sin((t - a) * 2 * Math.PI * 26);
  return 0;
};

/** 句1 — night facade of window lights; push in to one lit window; inside, the phone lights up and vibrates. */
export const Open1: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const wp = windowPos(...GRANDMA);
  const k = ramp(frame, [0, 3.7 * 30], [0, 1], (x) => x * x * x * 0.6 + x * 0.4);
  const far = [wp[0] + 14, wp[1] - 8, V ? 150 : 105];
  const near = [wp[0], wp[1], 1.1];
  const cam = lerp3(far, near, k);
  const look = lerp3([wp[0] + 2, wp[1] - 1, 0], wp, Math.min(1, k * 1.3));
  const inRoom = ramp(frame, [3.45 * 30, 3.85 * 30]); // scan into the room
  const rt = Math.max(0, t - 3.45);
  const shake = buzz(t, [[4.0, 0.55], [4.85, 0.55], [5.7, 0.3]]);
  const lit = ramp(frame, [3.9 * 30, 4.05 * 30]);
  const roomCam = lerp3(V ? [1.5, 1.9, 3.6] : [1.9, 1.5, 2.7], V ? [0.9, 1.4, 2.4] : [1.2, 1.15, 1.9], ramp(rt * 30, [0, 75]));
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <ThreeCanvas width={W} height={H} style={{position: 'absolute'}}>
        <color attach="background" args={['#050c0a']} />
        <fog attach="fog" args={['#050c0a', 30, 140]} />
        <CameraRig pos={cam} look={look} fov={V ? 55 : 38} />
        <CityWindows frame={frame} highlight={[GRANDMA]} />
        {/* neighbouring building, set back, for depth */}
        <group position={[-70, -8, -25]}><CityWindows frame={frame + 40} /></group>
        <group position={[72, 6, -30]}><CityWindows frame={frame + 80} /></group>
        <group position={[-20, 48, -60]}><CityWindows frame={frame + 120} /></group>
        <group position={[-130, 20, -70]}><CityWindows frame={frame + 160} /></group>
      </ThreeCanvas>
      {inRoom > 0 && (
        <AbsoluteFill style={{clipPath: `inset(0 ${100 - inRoom * 100}% 0 0)`}}>
          <ThreeCanvas width={W} height={H} style={{position: 'absolute'}} gl={{toneMapping: THREE.NoToneMapping}}>
            <color attach="background" args={['#06100d']} />
            <CameraRig pos={roomCam} look={[0.05, 0.45, 0]} fov={V ? 62 : 42} />
            <LivingRoom lit={lit} shake={shake} />
          </ThreeCanvas>
          <DepthBlur x={0.5} y={V ? 0.6 : 0.62} r={0.42} blur={7} />
        </AbsoluteFill>
      )}
      {inRoom > 0 && inRoom < 1 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${inRoom * 100}%`, width: 3, background: C.lime, boxShadow: `0 0 18px ${C.lime}`}} />}
      <div style={{position: 'absolute', left: W * (V ? 0.06 : 0.045), bottom: H * (V ? 0.3 : 0.2)}}>
        <MonoLabel size={22} color={C.limeDim}>21:00:{String(Math.min(59, Math.floor(t * 1.2) + 2)).padStart(2, '0')} · {inRoom < 1 ? 'EXT. APARTMENT' : 'INT. LIVING ROOM'}</MonoLabel>
      </div>
    </AbsoluteFill>
  );
};
