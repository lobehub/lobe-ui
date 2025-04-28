'use client';

import { useResponsive } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useStyles } from './style';
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
    const { cx, styles } = useStyles();

    return (
      <Flexbox
        align={'center'}
        as={'section'}
        className={cx(styles.root, className)}
        distribution={'space-between'}
        horizontal
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
              className={cx(styles.left, logoClassName)}
              horizontal
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
              className={cx(styles.left, logoClassName)}
              horizontal
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
              className={cx(styles.right, actionsClassName)}
              flex={1}
              horizontal
              justify={'space-between'}
              style={actionsStyle}
            >
              <div />
              <Flexbox align={'center'} gap={8} horizontal>
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
