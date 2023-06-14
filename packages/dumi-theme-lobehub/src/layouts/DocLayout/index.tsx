import { Layout, ThemeProvider } from '@lobehub/ui';
import { extractStaticStyle, useResponsive, useTheme } from 'antd-style';
import { Helmet, useIntl, useLocation } from 'dumi';
import isEqual from 'fast-deep-equal';
import { memo, useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { StoreUpdater } from '@/components/StoreUpdater';
import Changelog from '@/pages/Changelog';
import Docs from '@/pages/Docs';
import Home from '@/pages/Home';
import Footer from '@/slots/Footer';
import Header from '@/slots/Header';
import Sidebar from '@/slots/Sidebar';
import Toc from '@/slots/Toc';
import {
  isHeroPageSel,
  siteTitleSel,
  tocAnchorItemSel,
  useSiteStore,
  useThemeStore,
} from '@/store';
import customStylish from '@/styles/customStylish';
import customToken from '@/styles/customToken';

const DocLayout = memo(() => {
  const intl = useIntl();
  const { hash } = useLocation();
  const theme = useTheme();
  const { mobile, laptop } = useResponsive();

  const { fm, noToc, siteTitle, isHomePage, loading, isChanlogPage } = useSiteStore(
    (s) => ({
      fm: s.routeMeta.frontmatter,
      noToc: tocAnchorItemSel(s).length === 0,
      siteTitle: siteTitleSel(s),
      isHomePage: isHeroPageSel(s),
      loading: s.siteData.loading,
      isChanlogPage: s.location.pathname === '/changelog',
    }),
    shallow,
  );

  const hideSidebar = isHomePage || isChanlogPage || mobile || fm.sidebar === false;
  const shouldHideToc = fm.toc === false || noToc;
  const hideToc = mobile ? shouldHideToc : !laptop || shouldHideToc;

  const helmetBlock = (
    <Helmet>
      {!fm.title || isHomePage ? (
        <title>{siteTitle}</title>
      ) : (
        <title>
          {fm.title} - {siteTitle}
        </title>
      )}
    </Helmet>
  );

  // handle hash change or visit page hash after async chunk loaded
  useEffect(() => {
    const id = hash.replace('#', '');

    if (id) {
      setTimeout(() => {
        const elm = document.getElementById(decodeURIComponent(id));

        if (elm) {
          elm.scrollIntoView();
          window.scrollBy({ top: -80 });
        }
      }, 1);
    }
  }, [loading, hash]);

  return (
    <>
      <Helmet>
        <html lang={intl.locale.replace(/-.+$/, '')} />
        {fm.title && <meta content={fm.title} property="og:title" />}
        {fm.description && <meta content={fm.description} name="description" />}
        {fm.description && <meta content={fm.description} property="og:description" />}
        {fm.keywords && <meta content={fm.keywords.join(',')} name="keywords" />}
        {fm.keywords && <meta content={fm.keywords.join(',')} property="og:keywords" />}
      </Helmet>
      <Layout
        asideWidth={theme.sidebarWidth}
        footer={<Footer />}
        header={<Header />}
        headerHeight={mobile ? theme.headerHeight + 36 : theme.headerHeight}
        helmet={helmetBlock}
        sidebar={hideSidebar ? null : <Sidebar />}
        toc={hideToc ? null : <Toc />}
        tocWidth={hideToc ? 0 : theme.tocWidth}
      >
        {isHomePage && <Home />}
        {isChanlogPage && <Changelog />}
        {!isHomePage && !isChanlogPage && <Docs />}
      </Layout>
    </>
  );
});

// @ts-ignore
global.__ANTD_CACHE__ = extractStaticStyle.cache;

export default memo(() => {
  const themeMode = useThemeStore((st) => st.themeMode, isEqual);

  return (
    <>
      <StoreUpdater />
      <ThemeProvider
        cache={extractStaticStyle.cache}
        customStylish={customStylish}
        customToken={customToken}
        themeMode={themeMode}
      >
        <DocLayout />
      </ThemeProvider>
    </>
  );
});
