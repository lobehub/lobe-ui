'use client';

import type { IconType } from '@lobehub/icons';
import { memo } from 'react';

import { TITLE } from '../style';

const Icon: IconType = memo(({ size = '1em', style, ...rest }) => {
  return (
    <svg
      height={size}
      style={{ flex: 'none', lineHeight: 1, ...style }}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{TITLE}</title>
      <path
        d="M21.17 8.973c-.07.255-.161.503-.274.742h.003l-.014.031c-.8 1.795-2.888 5.32-2.888 5.32l-.009-.023-.61 1.115h2.94L14.702 24l1.275-5.334h-2.315l.804-3.527c-.652.164-1.418.391-2.33.698 0 0-1.23.757-3.548-1.458 0 0-1.563-1.443-.656-1.807.384-.152 1.87-.346 3.04-.515 1.577-.225 2.55-.345 2.55-.345s-4.869.078-6.024-.115c-1.155-.19-2.618-2.214-2.932-3.993 0 0-.483-.977 1.036-.516 1.52.462 7.814 1.8 7.814 1.8S5.234 6.256 4.69 5.614c-.543-.642-1.603-3.51-1.465-5.27 0 0 .061-.441.49-.324 0 0 6.052 2.906 10.188 4.493 4.137 1.59 7.732 2.402 7.268 4.46z"
        fill="#3296FA"
      />
    </svg>
  );
});

export default Icon;
