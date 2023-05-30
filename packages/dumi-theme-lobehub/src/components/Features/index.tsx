import { IFeature } from '@/types';
import { CSSProperties, memo } from 'react';
import FeatureItem from './Item';
import { useStyles } from './style';

export interface FeaturesProps {
  /**
   * @title Feature items
   * @description An array of feature items
   */
  items: IFeature[];
  /**
   * @title Style
   */
  style?: CSSProperties;
}

const Features = memo<FeaturesProps>(({ items, style }) => {
  const { styles } = useStyles();

  if (!Boolean(items?.length)) return null;

  return (
    <div className={styles.container} style={style}>
      {items!.map((item) => {
        return <FeatureItem key={item.title} {...item} />;
      })}
    </div>
  );
});

export default Features;
