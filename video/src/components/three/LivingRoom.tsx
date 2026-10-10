import React from 'react';
import * as THREE from 'three';
import {callScreenTexture, glowTexture} from './textures';

const M = (color: string, rough = 0.85) => <meshStandardMaterial color={color} roughness={rough} metalness={0.05} />;

/** Minimal 3D living room. The phone on the coffee table lights up (`lit`) and vibrates (`shake`). */
export const LivingRoom: React.FC<{lit: number; shake: number}> = ({lit, shake}) => {
  const screen = new THREE.Color('#0d211b').lerp(new THREE.Color('#ffffff'), lit);
  return (
    <group>
      <ambientLight intensity={0.12} color="#9fb7a8" />
      {/* moonlight through the window, directional */}
      <directionalLight position={[-3, 4, 2]} intensity={0.35} color="#8fa9c0" />
      {/* the phone screen light */}
      <pointLight position={[0, 0.75, 0.2]} intensity={lit * 3.2} distance={6} decay={1.6} color="#dceda5" />
      {/* warm side lamp, very dim */}
      <pointLight position={[2.4, 1.6, -1.2]} intensity={0.5} distance={4} color="#f2c48d" />

      {/* floor / walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[12, 10]} />{M('#13201c')}</mesh>
      <mesh position={[0, 2.5, -2.6]}><planeGeometry args={[12, 5]} />{M('#1b2a25')}</mesh>
      <mesh position={[-3.6, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[10, 5]} />{M('#17241f')}</mesh>
      {/* window with night city outside */}
      <mesh position={[-1.6, 2.4, -2.58]}><planeGeometry args={[1.8, 1.5]} /><meshBasicMaterial color="#06100d" /></mesh>
      {Array.from({length: 28}, (_, i) => (
        <mesh key={i} position={[-2.35 + (i % 7) * 0.25, 1.85 + Math.floor(i / 7) * 0.32, -2.57]}>
          <planeGeometry args={[0.1, 0.14]} />
          <meshBasicMaterial color={(i * 7) % 3 === 0 ? '#d8cf9f' : '#0d1c17'} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[-1.6, 2.4, -2.56]}><planeGeometry args={[0.04, 1.5]} /><meshBasicMaterial color="#2a3d36" /></mesh>
      {/* sofa */}
      <mesh position={[0, 0.25, -1.75]}><boxGeometry args={[3, 0.5, 0.9]} />{M('#243631')}</mesh>
      <mesh position={[0, 0.75, -2.12]}><boxGeometry args={[3, 0.7, 0.25]} />{M('#22332e')}</mesh>
      <mesh position={[-1.55, 0.5, -1.75]}><boxGeometry args={[0.2, 0.55, 0.9]} />{M('#22332e')}</mesh>
      <mesh position={[1.55, 0.5, -1.75]}><boxGeometry args={[0.2, 0.55, 0.9]} />{M('#22332e')}</mesh>
      {/* coffee table */}
      <mesh position={[0, 0.42, 0]}><boxGeometry args={[1.8, 0.06, 0.9]} />{M('#2d3a33', 0.5)}</mesh>
      {[[-0.8, -0.38], [0.8, -0.38], [-0.8, 0.38], [0.8, 0.38]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]}><boxGeometry args={[0.05, 0.4, 0.05]} />{M('#1c2723')}</mesh>
      ))}
      {/* cup */}
      <mesh position={[0.55, 0.51, -0.15]}><cylinderGeometry args={[0.06, 0.05, 0.12, 20]} />{M('#c9cfc6', 0.4)}</mesh>
      {/* phone */}
      <group position={[shake * 0.012, 0.455, 0.05]} rotation={[0, 0.35 + shake * 0.02, 0]}>
        <mesh><boxGeometry args={[0.2, 0.012, 0.42]} />{M('#0a0f0d', 0.3)}</mesh>
        <mesh position={[0, 0.0065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.185, 0.4]} />
          <meshBasicMaterial color={screen} map={lit > 0.05 ? callScreenTexture() : null} toneMapped={false} />
        </mesh>
        {/* soft light pool from the screen, only near the screen */}
        <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 1.6]} />
          <meshBasicMaterial map={glowTexture('rgba(220,237,165,0.5)')} transparent opacity={lit * 0.6} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      </group>
      {/* screen light cast on the back wall */}
      <mesh position={[0.1, 1.9, -2.55]}>
        <planeGeometry args={[3.6, 2.6]} />
        <meshBasicMaterial map={glowTexture('rgba(220,237,165,0.35)')} transparent opacity={lit * (0.75 + 0.25 * Math.abs(shake))} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
    </group>
  );
};
