import React from 'react';

/** Non-realistic person silhouette (no face). `who`: grandma (bun) or daughter (ponytail). Rim light from `rim` side. */
export const Silhouette: React.FC<{h: number; who?: 'grandma' | 'daughter'; rim?: 'left' | 'right'; rimColor?: string; phoneToEar?: boolean; style?: React.CSSProperties}> = ({h, who = 'grandma', rim = 'left', rimColor = '#dceda5', phoneToEar, style}) => {
  const id = `sil-${who}-${rim}`;
  return (
    <svg viewBox="0 0 400 500" height={h} style={{overflow: 'visible', ...style}}>
      <defs>
        <linearGradient id={id} x1={rim === 'left' ? 0 : 1} x2={rim === 'left' ? 1 : 0} y1="0" y2="0">
          <stop offset="0" stopColor={rimColor} stopOpacity="0.55" />
          <stop offset="0.12" stopColor="#0a1612" stopOpacity="1" />
          <stop offset="1" stopColor="#050c0a" stopOpacity="1" />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`}>
        {/* shoulders / body */}
        <path d="M40 500 C 40 390, 110 330, 200 325 C 290 330, 360 390, 360 500 Z" />
        {/* neck */}
        <rect x="172" y="250" width="56" height="90" rx="20" />
        {/* head */}
        <ellipse cx="200" cy="190" rx="78" ry="92" />
        {who === 'grandma'
          ? <ellipse cx="205" cy="92" rx="44" ry="34" />
          : <path d="M262 150 C 320 170, 330 260, 300 330 C 290 280, 280 230, 255 205 Z" />}
        {phoneToEar && <path d="M120 470 C 110 400, 100 300, 118 214 L 150 206 C 150 290, 160 380, 170 470 Z" />}
      </g>
    </svg>
  );
};
