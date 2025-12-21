'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';

import { useStyles } from './style';
import type { SpotlightCardItemProps } from './type';

const SpotlightCardItem = memo<SpotlightCardItemProps>(
  ({ children, className, style, borderRadius, size, ...rest }) => {
    const { styles, cx } = useStyles({ borderRadius, size });

    return (
      <Flexbox
        className={cx(styles.itemContainer, className)}
        style={{ borderRadius, ...style }}
        {...rest}
      >
        <Flexbox className={styles.content}>{children}</Flexbox>
      </Flexbox>
    );
  },
);

SpotlightCardItem.displayName = 'SpotlightCardItem';

export default SpotlightCardItem;
