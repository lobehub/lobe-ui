import { Skeleton } from 'antd';
import { useResponsive } from 'antd-style';
import type { FC, PropsWithChildren } from 'react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

// @ts-ignore
import ContentFooter from 'dumi/theme/slots/ContentFooter';

import { useSiteStore } from '../../store';

import { useStyles } from './style';

const Content: FC<PropsWithChildren> = ({ children }) => {
  const loading = useSiteStore((s) => s.siteData.loading);

  const { styles, cx } = useStyles();
  const { mobile } = useResponsive();

  return (
    <Flexbox width={'100%'} gap={mobile ? 0 : 24}>
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
