import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {hash} from '../../anim';

export const GRID = 16;
export const SPACING = 6;
/** Rooftop centre of block (i,j). */
export const blockTop = (i: number, j: number): [number, number, number] => {
  const h = 2 + hash(i * 31 + j * 7) * 9;
  return [(i - (GRID - 1) / 2) * SPACING, h, (j - (GRID - 1) / 2) * SPACING];
};

/** City seen from above: instanced blocks whose rooftops carry tiny window lights. */
export const CityTopDown: React.FC = () => {
  const blocks = useRef<THREE.InstancedMesh>(null);
  const lights = useRef<THREE.InstancedMesh>(null);
  const n = GRID * GRID;
  const per = 6;
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    for (let i = 0, k = 0, q = 0; i < GRID; i++) for (let j = 0; j < GRID; j++, k++) {
      const [x, h, z] = blockTop(i, j);
      o.position.set(x, h / 2, z); o.scale.set(4.2, h, 4.2); o.rotation.set(0, 0, 0); o.updateMatrix();
      blocks.current!.setMatrixAt(k, o.matrix);
      for (let w = 0; w < per; w++, q++) {
        const lit = hash(k * 13 + w) < 0.55;
        o.position.set(x - 1.4 + (w % 3) * 1.4, h + 0.02, z - 0.7 + Math.floor(w / 3) * 1.4);
        o.scale.set(0.7, 0.02, 0.5); o.updateMatrix();
        lights.current!.setMatrixAt(q, o.matrix);
        lights.current!.setColorAt(q, col.set(lit ? (hash(q) < 0.1 ? '#dceda5' : '#e9dfb8') : '#13261f').multiplyScalar(lit ? 0.6 + 0.4 * hash(q + 3) : 1));
      }
    }
    blocks.current!.instanceMatrix.needsUpdate = true;
    lights.current!.instanceMatrix.needsUpdate = true;
    if (lights.current!.instanceColor) lights.current!.instanceColor.needsUpdate = true;
  }, []);
  return (
    <group>
      <ambientLight intensity={0.35} />
      <directionalLight position={[30, 60, 20]} intensity={0.6} color="#9fb7a8" />
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[GRID * SPACING + 40, GRID * SPACING + 40]} /><meshStandardMaterial color="#07110e" /></mesh>
      <instancedMesh ref={blocks} args={[geo, undefined, n]}><meshStandardMaterial color="#14251f" roughness={0.9} /></instancedMesh>
      <instancedMesh ref={lights} args={[geo, undefined, n * per]}><meshBasicMaterial toneMapped={false} /></instancedMesh>
    </group>
  );
};
