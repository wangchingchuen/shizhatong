import React from 'react';
import {AbsoluteFill} from 'remotion';

/** Fake depth of field: blurs everything outside a focus ellipse (backdrop-filter + radial mask). */
export const DepthBlur: React.FC<{x?: number; y?: number; r?: number; blur?: number}> = ({x = 0.5, y = 0.5, r = 0.35, blur = 8}) => {
  const mask = `radial-gradient(ellipse ${r * 100}% ${r * 120}% at ${x * 100}% ${y * 100}%, transparent 40%, black 100%)`;
  return <AbsoluteFill style={{backdropFilter: `blur(${blur}px)`, WebkitMaskImage: mask, maskImage: mask, pointerEvents: 'none'}} />;
};
