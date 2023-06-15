import { useResponsive } from 'antd-style';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DivProps } from '@/types';

import { useStyle } from './style';

export interface HeaderProps extends DivProps {
  actions?: ReactNode;
  logo?: ReactNode;
  nav?: ReactNode;
}

const Header = memo<HeaderProps>(({ nav, logo, actions }) => {
  const { mobile } = useResponsive();
  const { styles } = useStyle();

  return (
    <section className={styles.header}>
      <Flexbox
        align={'center'}
        className={styles.content}
        distribution={'space-between'}
        horizontal
        width={'auto'}
      >
        {mobile ? (
          <>
            <Flexbox>{nav}</Flexbox>
            <Flexbox className={styles.left} horizontal>
              {logo}
            </Flexbox>
            <Flexbox>{actions}</Flexbox>
          </>
        ) : (
          <>
            <Flexbox className={styles.left} horizontal>
              {logo}
            </Flexbox>
            <Flexbox style={{ marginLeft: 48, alignSelf: 'end' }}>{nav}</Flexbox>
            <section className={styles.right}>
              <div />
              <Flexbox
                align={'center'}
                className="dumi-default-header-right-aside"
                gap={8}
                horizontal
              >
                {actions}
              </Flexbox>
            </section>
          </>
        )}
      </Flexbox>
    </section>
  );
});

export default Header;
