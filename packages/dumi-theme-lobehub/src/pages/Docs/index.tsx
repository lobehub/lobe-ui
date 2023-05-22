import { useResponsive } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo, type FC } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { Helmet, useOutlet } from 'dumi';
import Content from 'dumi/theme/slots/Content';
import Footer from 'dumi/theme/slots/Footer';
import Header from 'dumi/theme/slots/Header';
import Sidebar from 'dumi/theme/slots/Sidebar';
import Toc from 'dumi/theme/slots/Toc';
// @ts-ignore
import ApiHeader from 'dumi/theme/slots/ApiHeader';

import { isApiPageSel, siteTitleSel, tocAnchorItemSel, useSiteStore } from '@/store';
import { useStyles } from './styles';

const Docs: FC = memo(() => {
  const outlet = useOutlet();
  const { mobile } = useResponsive();
  const fm = useSiteStore((s) => s.routeMeta.frontmatter, isEqual);
  const isApiPage = useSiteStore(isApiPageSel);
  const siteTitle = useSiteStore(siteTitleSel);

  const noToc = useSiteStore((s) => tocAnchorItemSel(s).length === 0);
  const hideSidebar = fm.sidebar === false;
  const hideToc = fm.toc === false || noToc;

  const { styles, theme } = useStyles({ hideToc, hideSidebar });

  return (
    <div className={styles.layout}>
      <Helmet>
        {fm.title && (
          <title>
            {fm.title} - {siteTitle}
          </title>
        )}
      </Helmet>
      <Header />
      <div className={styles.view}>
        {mobile || hideSidebar ? null : <Sidebar />}
        <div className={styles.right}>
          <div className={styles.spacing} />
          {hideToc ? null : <Toc />}
          {isApiPage ? (
            <Flexbox style={{ gridArea: 'title', paddingBlock: mobile ? 24 : undefined }}>
              <Center>
                <Flexbox style={{ maxWidth: theme.contentMaxWidth, width: '100%' }}>
                  <Flexbox style={{ paddingBlock: 0, paddingInline: mobile ? 16 : 48 }}>
                    <ApiHeader />
                  </Flexbox>
                </Flexbox>
              </Center>
            </Flexbox>
          ) : null}
          <Flexbox
            style={{
              zIndex: 10,
              margin: mobile ? 0 : 24,
              marginBottom: mobile ? 0 : 48,
            }}
          >
            <Center width={'100%'}>
              <Flexbox className={styles.content}>
                <Flexbox horizontal>
                  <Content>{outlet}</Content>
                </Flexbox>
              </Flexbox>
            </Center>
          </Flexbox>
          <Footer />
        </div>
      </div>
    </div>
  );
});

export default Docs;
