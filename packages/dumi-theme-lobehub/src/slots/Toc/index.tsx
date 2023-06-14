import { useResponsive } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

import TocDesktop, { TocMobile } from '@/components/Toc';
import { tocAnchorItemSel, useSiteStore } from '@/store';

const Toc = memo(() => {
  const items = useSiteStore(tocAnchorItemSel, isEqual);
  const { mobile } = useResponsive();
  if (items?.length < 1) return null;
  return mobile ? (
    <TocMobile getContainer={() => document.body} items={items} />
  ) : (
    <>
      <div style={{ height: 100 }} />
      <TocDesktop getContainer={() => document.body} items={items} />
    </>
  );
});

export default Toc;
