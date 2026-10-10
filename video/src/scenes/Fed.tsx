import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {hash, ramp, spr} from '../anim';
import {C, FONT} from '../theme';
import {useLayout} from '../layout';
import {CameraRig} from '../components/three/CameraRig';
import {CityTopDown, GRID, blockTop} from '../components/three/CityTopDown';
import {SignalArc} from '../components/three/SignalArc';
import {glowTexture} from '../components/three/textures';
import {projector} from '../components/three/project';
import {MonoLabel} from '../components/MonoLabel';

const HUB: [number, number, number] = [0, 26, 0];
const SOURCES = Array.from({length: 22}, (_, k) => {
  const i = Math.floor(hash(k * 3.3) * GRID), j = Math.floor(hash(k * 7.7 + 1) * GRID);
  return {top: blockTop(i, j), at: 1.2 + (k % 8) * 0.22 + hash(k) * 0.3};
});

/** 句18 — top view of the whole city; many phones send small update arrows to the centre; a new version tag (model v1.1) returns — research only. */
export const Fed: React.FC = () => {
  const frame = useCurrentFrame();
  const {W, H, V, u} = useLayout();
  const t = frame / 30;
  const k = ramp(frame, [0, 210], [0, 1], (x) => x);
  const ang = 0.4 + k * 0.5;
  const dist = (V ? 120 : 85) + k * 25;
  const pos: [number, number, number] = [Math.sin(ang) * dist * 0.45, dist, Math.cos(ang) * dist * 0.45];
  const look: [number, number, number] = [0, 0, 0];
  const fov = V ? 60 : 45;
  const ret = ramp(frame, [4.1 * 30, 5.2 * 30]);
  const tag = spr(frame, 4.1, {damping: 13});
  const P = projector(pos, look, fov, W, H);
  const hub = P(HUB);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <ThreeCanvas width={W} height={H} style={{position: 'absolute'}}>
        <color attach="background" args={['#050c0a']} />
        <fog attach="fog" args={['#050c0a', 60, 260]} />
        <CameraRig pos={pos} look={look} fov={fov} />
        <CityTopDown />
        {SOURCES.map((s, i) => (
          <SignalArc key={i} a={s.top} b={HUB} progress={ramp(frame, [s.at * 30, (s.at + 0.9) * 30])} lift={2} radius={0.12} head={t < s.at + 0.95} />
        ))}
        <mesh position={HUB} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.6, 2.0, 48]} />
          <meshBasicMaterial color="#dceda5" toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={HUB}><planeGeometry args={[9, 9]} /><meshBasicMaterial map={glowTexture('rgba(220,237,165,0.6)')} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.4 + ret * 0.6} /></mesh>
        {ret > 0 && ret < 1 && (
          <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[ret * 70, ret * 70 + 0.8, 96]} />
            <meshBasicMaterial color="#dceda5" transparent opacity={1 - ret} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        )}
      </ThreeCanvas>
      <div style={{position: 'absolute', left: hub.x, top: hub.y - 70 * u, transform: `translate(-50%, -100%) scale(${0.7 + 0.3 * tag})`, opacity: tag, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 * u}}>
        <div style={{fontFamily: FONT.mono, fontWeight: 600, fontSize: 40 * u, color: C.bg, background: C.lime, padding: `${6 * u}px ${18 * u}px`, borderRadius: 6 * u, boxShadow: `0 0 ${30 * u}px rgba(220,237,165,0.5)`}}>model v1.1</div>
        <div style={{fontFamily: FONT.tc, fontWeight: 700, fontSize: 26 * u, color: C.lime, border: `1px solid ${C.lime}`, padding: `${2 * u}px ${12 * u}px`, borderRadius: 4 * u, background: 'rgba(6,16,13,0.8)'}}>研究中</div>
      </div>
      <div style={{position: 'absolute', left: W * (V ? 0.06 : 0.045), top: H * 0.12, display: 'flex', flexDirection: 'column', gap: 10 * u}}>
        <MonoLabel size={18} color={C.limeDim}>FEDERATED LEARNING · 研究規劃</MonoLabel>
        <MonoLabel size={16} color={C.textFaint}>參與與否 · 另外取得同意</MonoLabel>
      </div>
    </AbsoluteFill>
  );
};
