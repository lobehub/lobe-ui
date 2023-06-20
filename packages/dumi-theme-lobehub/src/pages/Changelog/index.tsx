import { useResponsive } from 'antd-style';
import { useOutlet } from 'dumi';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';
import { Center } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { ApiHeader } from '@/components/ApiHeader';
import { useStyles } from '@/pages/Docs/styles';
import Content from '@/slots/Content';
import { githubSel, useSiteStore } from '@/store';

const Changelog = memo(() => {
  const outlet = useOutlet();
  const { mobile } = useResponsive();
  const { repoBase } = useSiteStore(
    (s) => ({
      repoBase: githubSel(s),
    }),
    shallow,
  );

  const { fm } = useSiteStore(
    (s) => ({
      fm: s.routeMeta.frontmatter,
    }),
    isEqual,
  );

  const { styles } = useStyles();

  return (
    <>
      <div className={styles.background} />
      <Center
        className={styles.content}
        style={{
          padding: mobile ? 0 : 24,
        }}
      >
        <div style={{ padding: mobile ? 16 : 0, width: '100%' }}>
          <ApiHeader
            description={fm.description}
            docUrl={`${repoBase}/blob/master/CHANGELOG.md`}
            sourceUrl={`${repoBase}/blob/master/CHANGELOG.md`}
            title={fm.title}
          />
        </div>
        <Content className={styles.changelog}>{outlet}</Content>
      </Center>
    </>
  );
});

export default Changelog;
