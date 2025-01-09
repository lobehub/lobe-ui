'use client';

import { type IconType, useFillIds } from '@lobehub/icons';
import { forwardRef } from 'react';

import { TITLE } from '../style';

const Icon: IconType = forwardRef(({ size = '1em', style, ...rest }, ref) => {
  const [a, b, c] = useFillIds(TITLE, 3);
  return (
    <svg
      height={size}
      ref={ref}
      style={{ flex: 'none', lineHeight: 1, ...style }}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{TITLE}</title>
      <path d="M11.558 0l10.466 5.378L11.37 11.04 1 5.47 11.558 0z" fill={a.fill} />
      <path d="M14.154 12.866l7.87-7.488v11.184L14.154 24V12.866z" fill={b.fill} />
      <path d="M1 16.994l10.466 5.424-.096-11.378L1 5.47v11.524z" fill={c.fill} />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={a.id}
          x1="11.558"
          x2="11.558"
          y1="-.048"
          y2="10.752"
        >
          <stop stopColor="#522ED5" />
          <stop offset="1" stopColor="#9A88D5" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={b.id}
          x1="14.342"
          x2="9.461"
          y1="23.856"
          y2="10.13"
        >
          <stop stopColor="#522ED5" />
          <stop offset="1" stopColor="#9A88D5" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={c.id}
          x1="1.238"
          x2="2.077"
          y1="5.808"
          y2="22.639"
        >
          <stop stopColor="#522ED5" />
          <stop offset="1" stopColor="#9A88D5" />
        </linearGradient>
      </defs>
    </svg>
  );
});

export default Icon;
