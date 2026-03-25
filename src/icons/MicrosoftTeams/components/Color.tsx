'use client';

import type { IconType } from '@lobehub/icons';
import { memo } from 'react';

import { TITLE } from '../style';

const Icon: IconType = memo(({ size = '1em', style, ...rest }) => {
  return (
    <svg
      height={size}
      style={{ flex: 'none', lineHeight: 1, ...style }}
      viewBox="0 0 26 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{TITLE}</title>
      <path
        d="M17.996 9h6.664c.63 0 1.14.51 1.14 1.14v6.07a4.19 4.19 0 01-4.19 4.19h-.02a4.19 4.19 0 01-4.19-4.19V9.596c0-.33.267-.596.596-.596zM22.5 7.8a2.7 2.7 0 100-5.4 2.7 2.7 0 000 5.4z"
        fill="#5059C9"
      />
      <path
        d="M14.1 7.8a3.9 3.9 0 100-7.8 3.9 3.9 0 000 7.8zM19.3 9h-11a1.128 1.128 0 00-1.1 1.154v6.923A6.767 6.767 0 0013.8 24a6.767 6.767 0 006.6-6.923v-6.923A1.128 1.128 0 0019.3 9z"
        fill="#7B83EB"
      />
      <path
        d="M13.2 6.498v1.194A3.9 3.9 0 0110.5 5.4h1.602A1.102 1.102 0 0113.2 6.498z"
        fill="#000"
        opacity=".2"
      />
      <path
        d="M1.1 5.4h11a1.1 1.1 0 011.1 1.1v11a1.1 1.1 0 01-1.1 1.1h-11A1.1 1.1 0 010 17.5v-11a1.1 1.1 0 011.1-1.1z"
        fill="#4D55BD"
      />
      <path d="M9.494 9.587H7.295v5.988h-1.4V9.587h-2.19V8.425h5.79v1.162z" fill="#fff" />
    </svg>
  );
});

export default Icon;
