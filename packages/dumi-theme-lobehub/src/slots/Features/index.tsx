import { Features as F } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { memo } from 'react';
import { shallow } from 'zustand/shallow';

import { featuresSel, useSiteStore } from '@/store';

const Features = memo(() => {
  const features = useSiteStore(featuresSel, shallow);
  const theme = useTheme();

  if (!features?.length) return;

  return (
    <F contentMaxWidth={theme.contentMaxWidth} items={features} style={{ margin: '0 16px' }} />
  );
});

export default Features;
