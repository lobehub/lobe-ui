'use client';

import { type IconType, useFillIds } from '@lobehub/icons';
import { forwardRef } from 'react';

import { TITLE } from '../style';

const Icon: IconType = forwardRef(({ size = '1em', style, ...rest }, ref) => {
  const [a, b, c] = useFillIds(TITLE, 3);
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
        clipRule="evenodd"
        d="M22.588 3.296L4.113 17.35C1.845 13.238 1.06 8.276 1 5.3V3.478c0-.265.287-.42.431-.464 3.04-.916 9.215-2.776 9.587-2.882.371-.106.685-.132.796-.132h.01c.11 0 .424.026.796.132.372.106 6.546 1.966 9.586 2.882.107.033.294.127.382.282z"
        fill={a.fill}
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M4.113 17.374L22.588 3.32c.03.053.05.114.05.182v1.821c-.1 5.046-2.29 15.8-10.25 18.449-.11.044-.372.133-.531.133h-.076c-.16 0-.42-.089-.531-.133-3.265-1.087-5.56-3.536-7.137-6.397z"
        fill={b.fill}
        fillRule="evenodd"
      />
      <path
        d="M12.56.133A3.299 3.299 0 0011.762 0l-.033 23.928h.066c.16 0 .42-.088.531-.133 7.965-2.655 10.155-13.43 10.255-18.485V3.485c0-.266-.288-.42-.432-.465C19.108 2.102 12.931.24 12.56.133z"
        fill={c.fill}
        fillOpacity=".21"
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={a.id}
          x1="3.024"
          x2="11.089"
          y1="9.989"
          y2="1.56"
        >
          <stop stopColor="#45FFC8" />
          <stop offset="1" stopColor="#1DBBF1" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={b.id}
          x1="8.633"
          x2="18.656"
          y1="14.868"
          y2="19.747"
        >
          <stop stopColor="#D14AE8" />
          <stop offset=".552" stopColor="#B628E3" />
          <stop offset="1" stopColor="#8315FD" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={c.id}
          x1="17.129"
          x2="17.129"
          y1="2.257"
          y2="18.884"
        >
          <stop stopColor="#20ABF5" />
          <stop offset=".398" stopColor="#2A8CC3" />
          <stop offset="1" stopColor="#A104DC" />
        </linearGradient>
      </defs>
    </svg>
  );
});

export default Icon;
