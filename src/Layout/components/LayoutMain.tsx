'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { layoutClasses } from '../stable';
import { styles } from '../style';
import type { LayoutMainProps } from '../type';

export const LayoutMain = memo<LayoutMainProps>(({ children, className, ...rest }) => {
  return (
    <main
      className={styleProps(styles.main, clsx(layoutClasses('main'), className)).className}
      {...rest}
    >
      {children}
    </main>
  );
});

LayoutMain.displayName = 'LayoutMain';

export default LayoutMain;
