import { useResponsive } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Burger from '@/components/Burger';
import GithubButton from '@/components/GithubButton';
import ThemeSwitch from '@/components/ThemeSwitch';
import LangSwitch from '@/slots/LangSwitch';
import Logo from '@/slots/Logo';
import Navbar from '@/slots/Navbar';
import SearchBar from '@/slots/SearchBar';
import { useSiteStore } from '@/store/useSiteStore';

import { useStyle } from './style';

const Header = memo(() => {
  const hasHeader = useSiteStore((s) => Boolean(s.routeMeta.frontmatter));

  const { mobile } = useResponsive();
  const { styles } = useStyle();

  return !hasHeader ? null : (
    <header className={styles.header}>
      <Flexbox
        align={'center'}
        className={styles.content}
        distribution={'space-between'}
        horizontal
        width={'auto'}
      >
        {mobile ? (
          <>
            <Flexbox>
              <Burger />
            </Flexbox>
            <Flexbox className={styles.left} horizontal>
              <Logo />
            </Flexbox>
            <Flexbox>
              <ThemeSwitch />
            </Flexbox>
          </>
        ) : (
          <>
            <Flexbox className={styles.left} horizontal>
              <Logo />
            </Flexbox>
            <Flexbox style={{ marginLeft: 48, alignSelf: 'end' }}>
              <Navbar />
            </Flexbox>
            <section className={styles.right}>
              <div />
              <Flexbox
                align={'center'}
                className="dumi-default-header-right-aside"
                gap={8}
                horizontal
              >
                <SearchBar />
                <LangSwitch />
                <GithubButton />
                <ThemeSwitch />
              </Flexbox>
            </section>
          </>
        )}
      </Flexbox>
    </header>
  );
});

export default Header;
