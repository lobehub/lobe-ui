'use client';

import clsx from 'clsx';
import { memo } from 'react';

import SpotlightCard from '@/awesome/SpotlightCard';

import FeatureItem from './FeatureItem';
import { awesomeFeaturesClasses } from './stable';
import type { FeaturesProps } from './type';

const Features = memo<FeaturesProps>(
  ({ items, className, itemClassName, itemStyle, maxWidth, style, ...rest }) => {
    if (!items?.length) return;

    return (
      <SpotlightCard
        className={clsx(awesomeFeaturesClasses(), className)}
        items={items}
        style={maxWidth === undefined ? style : { maxWidth, ...style }}
        renderItem={(item: any) => (
          <FeatureItem className={itemClassName} key={item.title} style={itemStyle} {...item} />
        )}
        {...rest}
      />
    );
  },
);

Features.displayName = 'Features';

export default Features;
