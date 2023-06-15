import { Layout, ThemeProvider } from '@lobehub/ui';
import { extractStaticStyle, useResponsive, useTheme } from 'antd-style';
import { Helmet, useIntl, useLocation } from 'dumi';
import { memo, useCallback, useEffect } from 'react';
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

  const HelmetBlock = useCallback(
    () => (
      <Helmet>
        <html lang={intl.locale.replace(/-.+$/, '')} />
        {fm.title && <meta content={fm.title} property="og:title" />}
        {fm.description && <meta content={fm.description} name="description" />}
        {fm.description && <meta content={fm.description} property="og:description" />}
        {fm.keywords && <meta content={fm.keywords.join(',')} name="keywords" />}
        {fm.keywords && <meta content={fm.keywords.join(',')} property="og:keywords" />}
        {!fm.title || isHomePage ? (
          <title>{siteTitle}</title>
        ) : (
          <title>
            {fm.title} - {siteTitle}
          </title>
        )}
      </Helmet>
    ),
    [intl, fm, siteTitle, isHomePage],
  );

  // handle hash change or visit page hash after async chunk loaded
  useEffect(() => {
    const id = hash.replace('#', '');

    if (!id) return;
    setTimeout(() => {
      const elm = document.getElementById(decodeURIComponent(id));
      if (elm) {
        elm.scrollIntoView();
        window.scrollBy({ top: -80 });
      }
    }, 1);
  }, [loading, hash]);

  let Page;

  if (isHomePage) {
    Page = Home;
  } else if (isChanlogPage) {
    Page = Changelog;
  } else {
    Page = Docs;
  }

  return (
    <Layout
      asideWidth={theme.sidebarWidth}
      footer={<Footer />}
      header={<Header />}
      headerHeight={mobile && !isHomePage ? theme.headerHeight + 36 : theme.headerHeight}
      helmet={<HelmetBlock />}
      sidebar={hideSidebar ? null : <Sidebar />}
      toc={hideToc ? null : <Toc />}
      tocWidth={hideToc ? 0 : theme.tocWidth}
    >
      <Page />
    </Layout>
  );
});

// @ts-ignore
global.__ANTD_CACHE__ = extractStaticStyle.cache;

export default memo(() => {
  const themeMode = useThemeStore((st) => st.themeMode, shallow);

  return (
    <>
      <StoreUpdater />
      <ThemeProvider
        cache={extractStaticStyle.cache}
        customToken={customToken}
        themeMode={themeMode}
      >
        <DocLayout />
      </ThemeProvider>
    </>
  );
});
