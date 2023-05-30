import TOC from '@/components/Toc';
import { tocAnchorItemSel, useSiteStore } from '@/store';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

const Toc = memo(() => {
  const items = useSiteStore(tocAnchorItemSel, isEqual);

  return <TOC items={items} />;
});

export default Toc;
