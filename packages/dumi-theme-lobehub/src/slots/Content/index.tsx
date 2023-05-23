import { Skeleton, Typography } from 'antd';
import { useResponsive } from 'antd-style';
import type { FC, PropsWithChildren } from 'react';
import { memo, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';

// @ts-ignore
import ContentFooter from '@/slots/ContentFooter';

import { useSiteStore } from '@/store';

import { useStyles } from './style';

const Content: FC<PropsWithChildren> = ({ children }) => {
  const loading = useSiteStore((s) => s.siteData.loading);

  const { styles, cx } = useStyles();
  const { mobile } = useResponsive();

  useEffect(() => {
    document.querySelectorAll('.markdown').forEach((dom) => {
      dom.classList.add('ant-typography');
      dom.classList.add('css-dev-only-do-not-override-owqh1v');
    });
  }, [window.location.pathname]);

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
};

export default memo(Content);
