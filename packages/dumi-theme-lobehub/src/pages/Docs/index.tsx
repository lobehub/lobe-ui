import { Giscus } from '@lobehub/ui';
import { useResponsive } from 'antd-style';
import { useOutlet } from 'dumi';
import { memo, useCallback } from 'react';
import { Center } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import ApiHeader from '@/slots/ApiHeader';
import Content from '@/slots/Content';
import { isApiPageSel, useSiteStore } from '@/store';

import { useStyles } from './styles';

const Documents = memo(() => {
  const outlet = useOutlet();
  const { mobile } = useResponsive();
  const isApiPage = useSiteStore(isApiPageSel, shallow);
  const { styles } = useStyles();

  const Comment = useCallback(
    () => (
      <Giscus
        category="Q&A"
        categoryId="DIC_kwDOJloKoM4CXsCu"
        id="lobehub"
        mapping="title"
        repo="lobehub/lobe-ui"
        repoId="R_kgDOJloKoA"
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
          <Comment />
        </Content>
      </Center>
    </>
  );
});

export default Documents;
