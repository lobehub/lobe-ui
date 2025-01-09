'use client';

import type { IconType } from '@lobehub/icons';
import { forwardRef } from 'react';

import { TITLE } from '../style';

const Icon: IconType = forwardRef(({ size = '1em', style, ...rest }, ref) => {
  return (
    <svg
      fill="currentColor"
      fillRule="evenodd"
      height={size}
      ref={ref}
      style={{ flex: 'none', lineHeight: 1, ...style }}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{TITLE}</title>
      <path d="M11.558 0l10.466 5.378L11.37 11.04 1 5.47 11.558 0z" />
      <path d="M14.154 12.866l7.87-7.488v11.184L14.154 24V12.866z" />
      <path d="M1 16.994l10.466 5.424-.096-11.378L1 5.47v11.524z" />
    </svg>
  );
});

export default Icon;
