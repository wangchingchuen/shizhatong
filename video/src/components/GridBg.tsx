import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {useLayout} from '../layout';

/** Fine technical grid + directional (not omnidirectional) light. */
export const GridBg: React.FC<{light?: {x: number; y: number; color?: string; r?: number; a?: number}; drift?: number; opacity?: number}> = ({light, drift = 0.25, opacity = 1}) => {
  const frame = useCurrentFrame();
  const {u} = useLayout();
  const s = 48 * u;
  const off = (frame * drift) % s;
  return (
    <AbsoluteFill style={{background: C.bg, opacity}}>
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: `${s}px ${s}px`, backgroundPosition: `${off}px ${off * 0.5}px`,
      }} />
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(rgba(220,237,165,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(220,237,165,0.05) 1px, transparent 1px)`,
        backgroundSize: `${s * 5}px ${s * 5}px`, backgroundPosition: `${off}px ${off * 0.5}px`,
      }} />
      {light && (
        <AbsoluteFill style={{background: `radial-gradient(ellipse ${(light.r ?? 0.55) * 100}% ${(light.r ?? 0.55) * 70}% at ${light.x * 100}% ${light.y * 100}%, ${light.color ?? 'rgba(220,237,165,0.10)'} 0%, transparent 70%)`, opacity: light.a ?? 1}} />
      )}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
