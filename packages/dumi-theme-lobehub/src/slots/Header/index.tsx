import { Header as Head } from '@lobehub/ui';
import { useResponsive } from 'antd-style';
import { memo } from 'react';

import Logo from '@/slots/Logo';
import Navbar from '@/slots/Navbar';
import SearchBar from '@/slots/SearchBar';
import { useSiteStore } from '@/store/useSiteStore';

import Burger from './Burger';
import GithubButton from './GithubButton';
import LangSwitch from './LangSwitch';
import ThemeSwitch from './ThemeSwitch';

const Header = memo(() => {
  const hasHeader = useSiteStore((s) => Boolean(s.routeMeta.frontmatter));

  const { mobile } = useResponsive();
  if (!hasHeader) return;

  return (
    <Head
      actions={
        mobile ? (
          <ThemeSwitch />
        ) : (
          <>
            {' '}
            <SearchBar />
            <LangSwitch />
            <GithubButton />
            <ThemeSwitch />
          </>
        )
      }
      logo={<Logo />}
      nav={mobile ? <Burger /> : <Navbar />}
    />
  );
});

export default Header;
