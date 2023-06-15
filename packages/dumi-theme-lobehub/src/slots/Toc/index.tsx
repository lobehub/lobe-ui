import { Toc as T } from '@lobehub/ui';
import { useResponsive, useTheme } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo, useEffect, useState } from 'react';

import { tocAnchorItemSel, useSiteStore } from '@/store';

const GAP = 48;

const Toc = memo(() => {
  const items = useSiteStore(tocAnchorItemSel, isEqual);
  const { mobile } = useResponsive();
  const theme = useTheme();
  const [spacing, setSpacing] = useState<number>(GAP);

  useEffect(() => {
    const ApiTitle = document.getElementById('api-header');
    if (ApiTitle) setSpacing(ApiTitle.clientHeight + GAP);
  }, [window.location.href, items]);

  if (items?.length < 1) return null;

  return (
    <>
      {!mobile && <div style={{ height: spacing }} />}
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
