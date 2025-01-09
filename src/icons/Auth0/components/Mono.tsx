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
      <path d="M3.264 10.418c3.928-.648 7.008-3.9 7.653-7.834l.216-1.891c.054-.3-.15-.72-.529-.69-2.968.232-5.769 1.213-7.327 1.85A2.058 2.058 0 002 3.76v6.169c0 .365.328.644.688.586l.576-.094v-.003zM12.812 2.584c.647 3.934 3.726 7.186 7.652 7.835l.577.094c.36.06.688-.219.688-.586v-6.17c0-.836-.504-1.588-1.278-1.905-1.56-.64-4.358-1.619-7.326-1.85-.382-.03-.577.392-.532.689l.216 1.89.003.003zM20.461 12.146c-5.368 1.06-7.86 4.635-7.86 11.4 0 .34.336.576.62.387 2.468-1.668 7.9-6.021 8.46-11.467.021-.684-.834-.362-1.22-.32zM3.266 12.146c5.369 1.06 7.86 4.635 7.86 11.4 0 .34-.336.576-.618.387-2.47-1.668-7.902-6.021-8.461-11.467-.021-.684.834-.362 1.22-.32z" />
    </svg>
  );
});

export default Icon;
