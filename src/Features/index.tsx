import { CSSProperties, memo } from 'react';

import SpotlightCard, { SpotlightCardProps } from '@/SpotlightCard';
import { DivProps } from '@/types';

import { type FeatureItem, default as Item } from './Item';

export type { FeatureItem } from './Item';

export interface FeaturesProps extends DivProps {
  columns?: SpotlightCardProps['columns'];
  gap?: SpotlightCardProps['gap'];
  /**
   * @description The class name of the item
   */
  itemClassName?: string;
  /**
   * @description The style of the item
   */
  itemStyle?: CSSProperties;
  /**
   * @description The array of feature items
   */
  items: FeatureItem[];
  maxWidth?: number;
}

const Features = memo<FeaturesProps>(
  ({ items, className, itemClassName, itemStyle, maxWidth = 960, style, ...props }) => {
    if (!items?.length) return;

    return (
      <SpotlightCard
        className={className}
        items={items}
        renderItem={(item: any) => (
          <Item className={itemClassName} key={item.title} style={itemStyle} {...item} />
        )}
        style={{ maxWidth, ...style }}
        {...props}
      />
    );
  },
);

export default Features;
