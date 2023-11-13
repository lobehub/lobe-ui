import { memo } from 'react';

import { type DivProps } from '@/types';

import { useStyles } from './style';

export type DraggablePanelContainerProps = DivProps;

const DraggablePanelContainer = memo<DraggablePanelContainerProps>(
  ({ className, children, ...rest }) => {
    const { cx, styles } = useStyles();
    return (
      <div className={cx(styles.container, className)} {...rest}>
        {children}
      </div>
    );
  },
);

export default DraggablePanelContainer;
