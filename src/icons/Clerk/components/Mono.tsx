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
      <path d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM18.757 20.879c.319.319.287.847-.088 1.098A11.944 11.944 0 0111.999 24c-2.468 0-4.762-.745-6.67-2.023-.374-.25-.407-.779-.087-1.098l2.74-2.74c.248-.248.632-.287.944-.128a6.722 6.722 0 003.073.739 6.722 6.722 0 003.074-.739c.311-.16.695-.12.943.127l2.74 2.741z" />
      <path
        d="M18.67 2.023c.375.25.407.78.087 1.098l-2.74 2.74c-.248.248-.632.287-.944.128a6.75 6.75 0 00-9.085 9.085c.16.311.121.695-.126.943l-2.74 2.74c-.32.32-.848.288-1.1-.087A11.945 11.945 0 010 12C0 5.373 5.373 0 12 0c2.468 0 4.762.745 6.67 2.023z"
        fillOpacity=".5"
      />
    </svg>
  );
});

export default Icon;
