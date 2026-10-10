'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { useResponsive } from '@/styles/theme/scope';

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
        className={styleProps(styles.root, className).className}
        distribution={'space-between'}
        ref={ref}
        width={'auto'}
        {...rest}
      >
        {mobile ? (
          <>
            <Flexbox className={actionsClassName} style={{ flex: 0, ...navStyle }}>
              {nav}
              {children}
            </Flexbox>
            <Flexbox
              horizontal
              className={styleProps(styles.left, logoClassName).className}
              style={{ flex: 1, overflow: 'hidden', ...logoStyle }}
            >
              {logo}
            </Flexbox>
            <Flexbox className={actionsClassName} style={{ flex: 0, ...actionsStyle }}>
              {actions}
            </Flexbox>
          </>
        ) : (
          <>
            <Flexbox
              horizontal
              className={styleProps(styles.left, logoClassName).className}
              style={{ flex: 0, ...logoStyle }}
            >
              {logo}
            </Flexbox>
            <Flexbox
              className={navClassName}
              style={{ flex: 1, marginLeft: 48, overflow: 'hidden', ...navStyle }}
            >
              {nav}
              {children}
            </Flexbox>
            <Flexbox
              horizontal
              className={styleProps(styles.right, actionsClassName).className}
              flex={1}
              justify={'space-between'}
              style={actionsStyle}
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
