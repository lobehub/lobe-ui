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
      <path
        clipRule="evenodd"
        d="M3.883 16.921L22.175 3.005C19.124 2.085 12.99.238 12.62.132A3.302 3.302 0 0011.824 0h-.01c-.11 0-.425.026-.796.132-.372.106-6.546 1.966-9.587 2.882-.144.044-.431.199-.431.464v1.821c.057 2.874.791 7.598 2.883 11.622zm7.367 6.85c-3.097-1.03-5.32-3.288-6.887-5.958L22.638 3.909v1.413c-.1 5.046-2.29 15.8-10.25 18.449-.11.044-.372.133-.531.133h-.076c-.16 0-.42-.089-.531-.133z"
      />
    </svg>
  );
});

export default Icon;
