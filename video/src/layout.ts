import {useVideoConfig} from 'remotion';
// u = 1 at 1080 short side. V = vertical (1080×1920) version.
export const useLayout = () => {
  const {width: W, height: H} = useVideoConfig();
  const V = H > W;
  return {W, H, V, u: Math.min(W, H) / 1080};
};
