'use client';

import { createContext, memo, type ReactNode, use } from 'react';

import { type IconProps } from '../type';

export type IconContentConfig = Omit<IconProps, 'icon' | 'ref'>;

export const IconContext = createContext<IconContentConfig>({});

export const IconProvider = memo<{ children: ReactNode; config?: IconContentConfig }>(
  ({ children, config = {} }) => {
    return <IconContext value={config}>{children}</IconContext>;
  },
);

export const useIconContext = () => {
  return use(IconContext);
};
