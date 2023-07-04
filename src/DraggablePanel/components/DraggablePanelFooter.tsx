import { memo } from 'react';

import { type DivProps } from '@/types';

import { useStyles } from './style';

export type DraggablePanelFooterProps = DivProps;

const DraggablePanelFooter = memo<DraggablePanelFooterProps>(
  ({ className, children, ...props }) => {
    const { cx, styles } = useStyles();
    return (
      <div className={cx(styles.footer, className)} {...props}>
        {children}
      </div>
    );
  },
);

export default DraggablePanelFooter;
