'use client';

import type { IconType } from '@lobehub/icons';
import { memo } from 'react';

import { TITLE } from '../style';

const Icon: IconType = memo(({ size = '1em', style, ...rest }) => {
  return (
    <svg
      fill="currentColor"
      fillRule="evenodd"
      height={size}
      style={{ flex: 'none', lineHeight: 1, ...style }}
      viewBox="0 0 26 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{TITLE}</title>
      <path d="M19.3 9a1.129 1.129 0 011.1 1.153v6.924A6.768 6.768 0 0113.8 24a6.767 6.767 0 01-6.012-4h5.879c.736 0 1.333-.597 1.333-1.333V9h4.3zM24.66 9c.63 0 1.14.51 1.14 1.14v6.07a4.19 4.19 0 01-4.19 4.19h-.02l-.098-.002a8.889 8.889 0 00.506-2.752V9h2.662z" />
      <path
        clip-rule="evenodd"
        d="M12.1 5.4a1.1 1.1 0 011.1 1.086V17.5a1.1 1.1 0 01-1.1 1.1h-11A1.1 1.1 0 010 17.5v-11a1.1 1.1 0 011.1-1.1h11zM3.705 9.586h2.19v5.988h1.4V9.587h2.2V8.426h-5.79v1.16z"
      />
      <path d="M22.5 2.4a2.7 2.7 0 110 5.4 2.7 2.7 0 010-5.4zM14.1 0a3.9 3.9 0 01.9 7.693v-2.36C15 4.597 14.403 4 13.667 4h-3.465l-.002-.1A3.9 3.9 0 0114.1 0z" />
    </svg>
  );
});

export default Icon;
