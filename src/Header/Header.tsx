'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { useResponsive } from '@/styles/theme/scope';

import { headerClasses } from './stable';
import { styles } from './style';
import type { HeaderProps } from './type';

const Header = memo<HeaderProps>(
  ({
    actionsClassName,
    navClassName,
    logoClassName,
    nav,
    logo,
    actions,
    actionsStyle,
    logoStyle,
    navStyle,
    className,
    children,
    ref,
    ...rest
  }) => {
    const { mobile } = useResponsive();

    return (
      <Flexbox
        horizontal
        align={'center'}
        as={'section'}
        className={styleProps(styles.root, clsx(headerClasses(), className)).className}
        distribution={'space-between'}
        ref={ref}
        width={'auto'}
        {...rest}
      >
        {mobile ? (
          <>
            <Flexbox
              {...styleProps(styles.fixed, clsx(headerClasses('nav'), actionsClassName), navStyle)}
            >
              {nav}
              {children}
            </Flexbox>
            <Flexbox
              horizontal
              {...styleProps(
                [styles.left, styles.logoMobile],
                clsx(headerClasses('logo'), logoClassName),
                logoStyle,
              )}
            >
              {logo}
            </Flexbox>
            <Flexbox
              {...styleProps(
                styles.fixed,
                clsx(headerClasses('actions'), actionsClassName),
                actionsStyle,
              )}
            >
              {actions}
            </Flexbox>
          </>
        ) : (
          <>
            <Flexbox
              horizontal
              {...styleProps(
                [styles.left, styles.fixed],
                clsx(headerClasses('logo'), logoClassName),
                logoStyle,
              )}
            >
              {logo}
            </Flexbox>
            <Flexbox
              {...styleProps(styles.nav, clsx(headerClasses('nav'), navClassName), navStyle)}
            >
              {nav}
              {children}
            </Flexbox>
            <Flexbox
              horizontal
              flex={1}
              justify={'space-between'}
              style={actionsStyle}
              className={
                styleProps(styles.right, clsx(headerClasses('actions'), actionsClassName)).className
              }
            >
              <div />
              <Flexbox horizontal align={'center'} gap={8}>
                {actions}
              </Flexbox>
            </Flexbox>
          </>
        )}
      </Flexbox>
    );
  },
);

Header.displayName = 'Header';

export default Header;
