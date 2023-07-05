import GiscusComponent from '@giscus/react';
import { useResponsive, useThemeMode } from 'antd-style';
import { useOutlet } from 'dumi';
import { memo, useCallback } from 'react';
import { Center } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import ApiHeader from '@/slots/ApiHeader';
import Content from '@/slots/Content';
import { isApiPageSel, useSiteStore, useThemeStore } from '@/store';

import { useStyles } from './styles';

const Documents = memo(() => {
  const themeMode = useThemeStore((st) => st.themeMode, shallow);
  const { appearance } = useThemeMode();
  const outlet = useOutlet();
  const { mobile } = useResponsive();
  const isApiPage = useSiteStore(isApiPageSel, shallow);
  const { styles } = useStyles();

  const theme = themeMode === 'auto' ? appearance : themeMode;
  const Giscus = useCallback(
    () => (
      <GiscusComponent
        category="Q&A"
        categoryId="DIC_kwDOJloKoM4CXsCu"
        emitMetadata="0"
        id="giscus"
        inputPosition="top"
        lang="en"
        loading="lazy"
        mapping="title"
        reactionsEnabled="1"
        repo="lobehub/lobe-ui"
        repoId="R_kgDOJloKoA"
        strict="0"
        term="Welcome to @lobehub/ui component!"
        theme={theme === 'dark' ? 'transparent_dark' : 'light'}
      />
    ),
    [location.pathname],
  );
  return (
    <>
      <div className={styles.background} />
      <Center className={styles.content} style={{ marginBottom: 48, padding: mobile ? 0 : 24 }}>
        {isApiPage ? (
          <div style={{ padding: mobile ? 16 : 0, width: '100%' }}>
            <ApiHeader />
          </div>
        ) : undefined}
        <Content>
          {outlet}
          <Giscus />
        </Content>
      </Center>
    </>
  );
});

export default Documents;
