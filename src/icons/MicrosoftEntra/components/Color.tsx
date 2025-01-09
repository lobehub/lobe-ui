'use client';

import type { IconType } from '@lobehub/icons';
import { forwardRef } from 'react';

import { TITLE } from '../style';

const Icon: IconType = forwardRef(({ size = '1em', style, ...rest }, ref) => {
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
      <path
        d="M5.07 18.376c.517.323 1.377.681 2.286.681.828 0 1.597-.24 2.235-.649l.002-.001L12 16.903v5.43a2.08 2.08 0 01-1.099-.312L5.07 18.376z"
        fill="#225086"
      />
      <path
        d="M10.47 1.676l-10 11.28c-.771.872-.57 2.19.431 2.815l4.168 2.605c.518.323 1.378.681 2.287.681.828 0 1.597-.24 2.235-.649l.002-.001L12 16.903l-5.819-3.638 5.82-6.565V1c-.565 0-1.13.225-1.53.676z"
        fill="#6DF"
      />
      <path d="M6.181 13.265l.07.043L12 16.903h.001V6.7H12l-5.819 6.564z" fill="#CBF8FF" />
      <path
        d="M23.099 15.77c1.001-.625 1.202-1.942.43-2.814l-6.561-7.401a4.136 4.136 0 00-1.75-.388 4.07 4.07 0 00-3.07 1.368l-.145.164 5.818 6.565-5.82 3.637v5.431c.383 0 .764-.104 1.098-.312l10-6.25z"
        fill="#074793"
      />
      <path
        d="M12.001 1v5.7l.146-.164a4.07 4.07 0 013.069-1.368c.63 0 1.221.143 1.75.388l-3.438-3.879A2.032 2.032 0 0012 1.001L12.001 1z"
        fill="#0294E4"
      />
      <path d="M17.82 13.265l-5.819-6.564v10.2l5.819-3.636z" fill="#96BCC2" />
    </svg>
  );
});

export default Icon;
