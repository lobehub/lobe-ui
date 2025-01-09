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
        d="M23.53 12.956c.771.872.57 2.19-.431 2.815v-.002l-10 6.251a2.072 2.072 0 01-1.098.312v-.001l-.001.002a2.08 2.08 0 01-1.099-.312L5.07 18.376c.518.323 1.378.681 2.287.681.828 0 1.597-.24 2.235-.649l.002-.001L12 16.903l.001.002v-.004l5.82-3.637-5.818-6.565.145-.164a4.07 4.07 0 013.07-1.368c.627 0 1.22.141 1.75.388l6.561 7.401z"
        fillOpacity=".5"
      />
      <path d="M.47 12.956l10-11.28c.4-.45.966-.676 1.531-.676v.001c.564 0 1.129.226 1.527.676l3.439 3.879a4.152 4.152 0 00-1.751-.388 4.07 4.07 0 00-3.07 1.368l-5.965 6.73L12 16.902l-2.407 1.504-.002.001c-.638.41-1.407.65-2.235.65-.91 0-1.77-.36-2.287-.682L.901 15.771C-.1 15.145-.3 13.828.471 12.956z" />
    </svg>
  );
});

export default Icon;
