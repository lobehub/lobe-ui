import { Toc as T } from '@lobehub/ui';
import { useResponsive, useTheme } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

import { tocAnchorItemSel, useSiteStore } from '@/store';

const Toc = memo(() => {
  const items = useSiteStore(tocAnchorItemSel, isEqual);
  const { mobile } = useResponsive();
  const theme = useTheme();
  if (items?.length < 1) return null;
  return (
    <>
      {!mobile && <div style={{ height: 100 }} />}
      <T
        getContainer={() => document.body}
        headerHeight={theme.headerHeight}
        isMobile={mobile}
        items={items}
        tocWidth={theme.tocWidth}
      />
    </>
  );
});

export default Toc;
