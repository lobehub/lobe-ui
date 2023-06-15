import { useResponsive } from 'antd-style';
import { useOutlet } from 'dumi';
import { memo, useEffect } from 'react';
import { Center } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import ApiHeader from '@/slots/ApiHeader';
import Content from '@/slots/Content';
import { isApiPageSel, useSiteStore } from '@/store';

import { useStyles } from './styles';

const Docs = memo(() => {
  const outlet = useOutlet();
  const { mobile } = useResponsive();
  const { isApiPage } = useSiteStore(
    (s) => ({
      isApiPage: isApiPageSel(s),
    }),
    shallow,
  );
  const { styles } = useStyles();

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.background} />
      <Center className={styles.content} style={{ padding: mobile ? 0 : 24, marginBottom: 48 }}>
        {isApiPage ? (
          <div style={{ padding: mobile ? 16 : 0, width: '100%' }}>
            <ApiHeader />
          </div>
        ) : null}
        <Content>{outlet}</Content>
      </Center>
    </>
  );
});

export default Docs;
