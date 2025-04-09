'use client';

import { memo } from 'react';

import SpotlightCard from '@/awesome/SpotlightCard';

import FeatureItem from './FeatureItem';
import type { FeaturesProps } from './type';

const Features = memo<FeaturesProps>(
  ({ items, className, itemClassName, itemStyle, maxWidth = 960, style, ...rest }) => {
    if (!items?.length) return;

    return (
      <SpotlightCard
        className={className}
        items={items}
        renderItem={(item: any) => (
          <FeatureItem className={itemClassName} key={item.title} style={itemStyle} {...item} />
        )}
        style={{ maxWidth, ...style }}
        {...rest}
      />
    );
  },
);

Features.displayName = 'Features';

export default Features;
