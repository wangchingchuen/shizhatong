import React from 'react';

/** Pointer cursor with click ripple. `click` = seconds since click (negative = not yet). */
export const Cursor: React.FC<{x: number; y: number; size: number; click: number}> = ({x, y, size, click}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0}}>
    {click >= 0 && click < 0.6 && (
      <div style={{position: 'absolute', left: -size * (0.4 + click * 1.4), top: -size * (0.4 + click * 1.4), width: size * (0.8 + click * 2.8), height: size * (0.8 + click * 2.8),
        borderRadius: '50%', border: `2px solid #dceda5`, opacity: 1 - click / 0.6}} />
    )}
    <svg width={size} height={size * 1.4} viewBox="0 0 20 28" style={{transform: `scale(${click >= 0 && click < 0.15 ? 0.88 : 1})`, transformOrigin: '0 0', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))'}}>
      <path d="M1 1 L1 22 L6.5 17 L10 26 L13.5 24.5 L10 16 L17.5 16 Z" fill="#f4f6f2" stroke="#0b1c17" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  </div>
);
