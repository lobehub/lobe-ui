import { CSSProperties, memo } from 'react';

import { DivProps } from '@/types';

import { type FeatureItem, default as Item } from './Item';
import { useStyles } from './style';

export type { FeatureItem } from './Item';

export interface FeaturesProps extends DivProps {
  /**
   * @description The maximum width of the content
   * @default 960
   */
  contentMaxWidth?: number;
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
}

const Features = memo<FeaturesProps>(
  ({ items, contentMaxWidth = 960, className, itemClassName, itemStyle, ...properties }) => {
    const { cx, styles } = useStyles(contentMaxWidth);

    if (!items?.length) return;

    return (
      <div className={cx(styles.container, className)} {...properties}>
        {items!.map((item) => {
          return <Item className={itemClassName} key={item.title} style={itemStyle} {...item} />;
        })}
      </div>
    );
  },
);

export default Features;
