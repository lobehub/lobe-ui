'use client';

import { CSSProperties, memo } from 'react';

import SpotlightCard, { SpotlightCardProps } from '@/awesome/SpotlightCard';
import { DivProps } from '@/types';

import { type FeatureItem, default as Item } from './Item';

export type { FeatureItem } from './Item';

export interface FeaturesProps extends DivProps {
  columns?: SpotlightCardProps['columns'];
  gap?: SpotlightCardProps['gap'];
  itemClassName?: string;
  itemStyle?: CSSProperties;
  items: FeatureItem[];
  maxWidth?: number;
}

const Features = memo<FeaturesProps>(
  ({ items, className, itemClassName, itemStyle, maxWidth = 960, style, ...rest }) => {
    if (!items?.length) return;

    return (
      <SpotlightCard
        className={className}
        items={items}
        renderItem={(item: any) => (
          <Item className={itemClassName} key={item.title} style={itemStyle} {...item} />
        )}
        style={{ maxWidth, ...style }}
        {...rest}
      />
    );
  },
);

Features.displayName = 'Features';

export default Features;
