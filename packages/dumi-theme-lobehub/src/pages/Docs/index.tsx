import { useResponsive } from 'antd-style';
import { useOutlet } from 'dumi';
import { memo } from 'react';
import { Center } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import ApiHeader from '@/slots/ApiHeader';
import Content from '@/slots/Content';
import { isApiPageSel, useSiteStore } from '@/store';

import { useStyles } from './styles';

const Documents = memo(() => {
  const outlet = useOutlet();
  const { mobile } = useResponsive();
  const { isApiPage } = useSiteStore(
    (s) => ({
      isApiPage: isApiPageSel(s),
    }),
    shallow,
  );
  const { styles } = useStyles();

  return (
    <>
      <div className={styles.background} />
      <Center className={styles.content} style={{ marginBottom: 48, padding: mobile ? 0 : 24 }}>
        {isApiPage ? (
          <div style={{ padding: mobile ? 16 : 0, width: '100%' }}>
            <ApiHeader />
          </div>
        ) : undefined}
        <Content>{outlet}</Content>
      </Center>
    </>
  );
});

export default Documents;
