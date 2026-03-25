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
      <path d="M12.09 0c5.352 0 7.528 4.632 7.528 9.244 0 .274-.012.802-.012.833l-.011.007 1.079 2.69h.007c.223.579.444 1.174.63 1.727l.166.53c1.025 3.283.69 4.644.441 4.675-.54.062-2.1-2.475-2.1-2.475 0 1.472-.759 3.391-2.399 4.777.614.188 1.37.48 1.857.837.436.317.38.646.298.777-.343.578-5.887.367-7.484.187-1.598.18-7.143.391-7.484-.187-.081-.13-.137-.46.298-.777.487-.356 1.24-.648 1.854-.836-1.641-1.386-2.401-3.306-2.401-4.778 0 0-1.56 2.543-2.101 2.475-.249-.031-.578-1.392.441-4.675.211-.688.502-1.488.8-2.257h-.004l1.081-2.697-.011-.833C4.563 4.632 6.738 0 12.09 0z" />
    </svg>
  );
});

export default Icon;
