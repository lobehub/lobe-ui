import FeatureBlock from '@/components/Features';
import { featuresSel, useSiteStore } from '@/store';
import { memo } from 'react';
import { shallow } from 'zustand/shallow';

const Features = memo(() => {
  const features = useSiteStore(featuresSel, shallow);

  if (!Boolean(features?.length)) return null;

  return <FeatureBlock items={features} style={{ margin: '0 16px' }} />;
});

export default Features;
