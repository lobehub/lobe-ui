import { useResponsive } from 'antd-style';
import { CSSProperties, ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DivProps } from '@/types';

import { useStyles } from './style';

export interface HeaderProps extends DivProps {
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
    ...props
  }) => {
    const { mobile } = useResponsive();
    const { cx, styles } = useStyles();

    return (
      <section className={cx(styles.header, className)} {...props}>
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
              <section className={cx(styles.right, actionsClassName)} style={actionsStyle}>
                <div />
                <Flexbox align={'center'} gap={8} horizontal>
                  {actions}
                </Flexbox>
              </section>
            </>
          )}
        </Flexbox>
      </section>
    );
  },
);

export default Header;
