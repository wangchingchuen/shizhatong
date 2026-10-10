import * as THREE from 'three';

/** Project a world point to screen pixels for a camera defined the same way as <CameraRig/>. */
export const projector = (pos: [number, number, number], look: [number, number, number], fov: number, W: number, H: number) => {
  const cam = new THREE.PerspectiveCamera(fov, W / H, 0.1, 2000);
  cam.position.set(...pos);
  cam.lookAt(...look);
  cam.updateMatrixWorld();
  return (p: [number, number, number]) => {
    const v = new THREE.Vector3(...p).project(cam);
    return {x: ((v.x + 1) / 2) * W, y: ((1 - v.y) / 2) * H};
  };
};
