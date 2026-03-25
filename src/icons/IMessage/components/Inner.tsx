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
      <path d="M12 1.297c1.576 0 3.137.258 4.593.76a12.393 12.393 0 013.893 2.168c1.114.928 1.998 2.03 2.601 3.243A8.567 8.567 0 0124 11.293c0 2.65-1.265 5.192-3.515 7.066-2.25 1.874-5.303 2.927-8.485 2.927a14.25 14.25 0 01-3.395-.413c-1.43.948-3.097 1.603-4.874 1.914.916-.885 1.625-1.877 2.098-2.935-1.775-.887-3.245-2.141-4.267-3.64-1.021-1.5-1.56-3.195-1.562-4.92C0 9.98.31 8.68.913 7.469 1.516 6.255 2.4 5.153 3.514 4.225a12.392 12.392 0 013.893-2.167A14.116 14.116 0 0112 1.297z" />
    </svg>
  );
});

export default Icon;
