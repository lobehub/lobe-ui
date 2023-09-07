import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DivProps } from '@/types';

import { useStyles } from './style';

const SpotlightCardItem = memo<DivProps>(({ children, className, ...props }) => {
  const { styles, cx } = useStyles();

  return (
    <div className={cx(className, styles.itemContainer)} {...props}>
      <Flexbox className={styles.content}>{children}</Flexbox>
    </div>
  );
});

export default SpotlightCardItem;
