import { memo } from 'react';

import { type DivProps } from '@/types';

import { useStyles } from './style';

export type DraggablePanelBodyProps = DivProps;

const DraggablePanelBody = memo<DraggablePanelBodyProps>(({ className, children, ...props }) => {
  const { cx, styles } = useStyles();
  return (
    <div className={cx(styles.body, className)} {...props}>
      {children}
    </div>
  );
});

export default DraggablePanelBody;
