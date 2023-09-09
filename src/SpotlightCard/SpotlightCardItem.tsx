import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DivProps } from '@/types';

import { useStyles } from './style';

export interface SpotlightCardItemProps extends DivProps {
  borderRadius: number;
  size: number;
}

const SpotlightCardItem = memo<SpotlightCardItemProps>(
  ({ children, className, style, borderRadius, size, ...props }) => {
    const { styles, cx } = useStyles({ borderRadius, size });

    return (
      <div
        className={cx(className, styles.itemContainer)}
        style={{ borderRadius, ...style }}
        {...props}
      >
        <Flexbox className={styles.content}>{children}</Flexbox>
      </div>
    );
  },
);

export default SpotlightCardItem;
