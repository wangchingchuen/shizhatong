import React, {useMemo} from 'react';
import * as THREE from 'three';
import {glowTexture} from './textures';

/** A light line drawn from `a` to `b` along an arc; progress 0..1. */
export const SignalArc: React.FC<{a: [number, number, number]; b: [number, number, number]; progress: number; color?: string; lift?: number; radius?: number; head?: boolean}> = ({a, b, progress, color = '#dceda5', lift = 7, radius = 0.12, head = true}) => {
  const curve = useMemo(() => {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
    const M = A.clone().lerp(B, 0.5).add(new THREE.Vector3(0, lift * 0.6, lift));
    return new THREE.QuadraticBezierCurve3(A, M, B);
  }, [a, b, lift]);
  if (progress <= 0.001) return null;
  const pts = Array.from({length: 48}, (_, i) => curve.getPoint((i / 47) * progress));
  const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 96, radius, 8, false);
  const end = pts[pts.length - 1];
  return (
    <group>
      <mesh geometry={geo}><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      {head && (
        <mesh position={end}>
          <planeGeometry args={[3, 3]} />
          <meshBasicMaterial map={glowTexture('rgba(220,237,165,0.9)')} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};
