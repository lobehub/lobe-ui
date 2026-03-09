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
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{TITLE}</title>
      <path d="M5.285 0A5.273 5.273 0 000 5.285v13.43A5.273 5.273 0 005.285 24h13.43A5.272 5.272 0 0024 18.715V5.285A5.271 5.271 0 0018.715 0H5.285zM12 4.154c1.157 0 2.303.19 3.371.559 1.07.368 2.04.909 2.858 1.59a7.407 7.407 0 011.91 2.381c.442.89.67 1.844.67 2.808 0 1.946-.928 3.812-2.58 5.187-1.652 1.376-3.893 2.149-6.229 2.149a10.46 10.46 0 01-2.492-.303A9.432 9.432 0 015.93 19.93a6.972 6.972 0 001.54-2.155c-1.303-.65-2.382-1.572-3.132-2.672-.75-1.101-1.145-2.345-1.147-3.611 0-.964.228-1.918.67-2.808a7.408 7.408 0 011.91-2.38 9.097 9.097 0 012.858-1.591A10.362 10.362 0 0112 4.154z" />
    </svg>
  );
});

export default Icon;
