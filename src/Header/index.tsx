'use client';

import { useResponsive } from 'antd-style';
import { CSSProperties, ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DivProps } from '@/types';

import { useStyles } from './style';

export interface HeaderProps extends DivProps {
  /**
   * @description Actions to be displayed on the right side of the header
   */
  actions?: ReactNode;
  /**
   * @description Class name for actions container
   */
  actionsClassName?: string;
  /**
   * @description Style for actions container
   */
  actionsStyle?: CSSProperties;
  /**
   * @description Logo to be displayed on the left side of the header
   */
  logo?: ReactNode;
  /**
   * @description Class name for logo container
   */
  logoClassName?: string;
  /**
   * @description Style for logo container
   */
  logoStyle?: CSSProperties;
  /**
   * @description Navigation to be displayed on the right side of the logo
   */
  nav?: ReactNode;
  /**
   * @description Class name for navigation container
   */
  navClassName?: string;
  /**
   * @description Style for navigation container
   */
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
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const { cx, styles } = useStyles();

    return (
      <section className={cx(styles.header, className)} {...rest}>
        <Flexbox
          align={'center'}
          className={styles.content}
          distribution={'space-between'}
          horizontal
          width={'auto'}
        >
          {mobile ? (
            <>
              <Flexbox className={actionsClassName} style={{ flex: 0, ...navStyle }}>
                {nav}
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
      </section>
    );
  },
);

export default Header;
