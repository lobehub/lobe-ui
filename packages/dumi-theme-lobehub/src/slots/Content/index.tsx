import ContentFooter from '@/slots/ContentFooter';
import { useSiteStore } from '@/store';
import { Skeleton, Typography } from 'antd';
import { useResponsive } from 'antd-style';
import type { PropsWithChildren } from 'react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { useStyles } from './style';

const Content = memo<PropsWithChildren>(({ children }) => {
  const loading = useSiteStore((s) => s.siteData.loading);

  const { styles, cx } = useStyles();
  const { mobile } = useResponsive();

  return (
    <Flexbox width={'100%'} gap={mobile ? 0 : 24}>
      <Typography />
      <div className={cx('dumi-antd-style-content', styles.content)}>
        <Skeleton active paragraph loading={loading} />
        <div
          style={{
            display: loading ? 'none' : undefined,
          }}
        >
          {children}
        </div>
      </div>
      <ContentFooter />
    </Flexbox>
  );
});

export default Content;
