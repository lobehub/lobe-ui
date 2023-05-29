import TOC from '@/components/Toc';
import { tocAnchorItemSel, useSiteStore } from '@/store';
import isEqual from 'fast-deep-equal';
import { memo, type FC } from 'react';

const Toc: FC = memo(() => {
  const items = useSiteStore(tocAnchorItemSel, isEqual);

  return <TOC items={items} />;
});

export default Toc;
