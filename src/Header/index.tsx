'use client';

import { useResponsive } from 'antd-style';
import { CSSProperties, ReactNode, memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { useStyles } from './style';

export interface HeaderProps extends FlexboxProps {
  actions?: ReactNode;
  actionsClassName?: string;
  actionsStyle?: CSSProperties;
  logo?: ReactNode;
  logoClassName?: string;
  logoStyle?: CSSProperties;
  nav?: ReactNode;
  navClassName?: string;
  navStyle?: CSSProperties;
}

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
