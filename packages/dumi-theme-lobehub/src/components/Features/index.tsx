import { CSSProperties, type FC } from 'react';

import { IFeature } from '../../types';
import FeatureItem from './Item';
import { useStyles } from './style';

/**
 * @title Features Props
 */
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

const Features: FC<FeaturesProps> = ({ items, style }) => {
  const { styles } = useStyles();

  if (!Boolean(items?.length)) return null;

  return (
    <div className={styles.container} style={style}>
      {items!.map((item) => {
        return <FeatureItem key={item.title} {...item} />;
      })}
    </div>
  );
};

export default Features;
