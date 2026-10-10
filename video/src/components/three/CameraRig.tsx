import {useThree} from '@react-three/fiber';
import {useLayoutEffect} from 'react';
import type {PerspectiveCamera} from 'three';

/** Drives the R3F camera from frame-computed values (Remotion renders frames, not a clock). */
export const CameraRig: React.FC<{pos: [number, number, number]; look: [number, number, number]; fov?: number; roll?: number}> = ({pos, look, fov = 40, roll = 0}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const cam = camera as PerspectiveCamera;
    cam.position.set(...pos);
    cam.up.set(Math.sin(roll), Math.cos(roll), 0);
    cam.lookAt(...look);
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
  });
  return null;
};
