import isEqual from 'fast-deep-equal';
import { memo, type FC } from 'react';

import TOC from '../../components/Toc';
import { tocAnchorItemSel, useSiteStore } from '../../store';

const Toc: FC = memo(() => {
  const items = useSiteStore(tocAnchorItemSel, isEqual);

  return <TOC items={items} />;
});

export default Toc;
