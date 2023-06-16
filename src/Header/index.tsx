import { useResponsive } from 'antd-style';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DivProps } from '@/types';

import { useStyles } from './style';

export interface HeaderProps extends DivProps {
  actions?: ReactNode;
  logo?: ReactNode;
  nav?: ReactNode;
}

const Header = memo<HeaderProps>(({ nav, logo, actions }) => {
  const { mobile } = useResponsive();
  const { styles } = useStyles();

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
            <Flexbox style={{ alignSelf: 'end', marginLeft: 48 }}>{nav}</Flexbox>
            <section className={styles.right}>
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
});

export default Header;
