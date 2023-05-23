import { DraggablePanel } from '@/index';
import { useResponsive } from 'antd-style';
import { LevaPanel, useControls, useCreateStore } from 'leva';
import React from 'react';
import { useStyles } from './style';

export { useCreateStore, useControls };
export interface StroyBookProps extends DivProps {
  /**
   * @description The Leva store instance to be used by the component
   * @type levaStore
   */
  levaStore: any;
  /**
   * @description If use padding around component
   */
  noPadding?: boolean;
}

export const StroyBook: React.FC<StroyBookProps> = ({
  levaStore,
  noPadding,
  className,
  children,
  ...props
}) => {
  const { mobile } = useResponsive();
  const { styles, cx } = useStyles({ noPadding: Boolean(noPadding), mobile: Boolean(mobile) });
  return (
    <div className={cx(styles.editor, className)} {...props}>
      <div className={styles.left}>{children}</div>
      <DraggablePanel className={styles.right} placement={mobile ? 'bottom' : 'right'}>
        <LevaPanel fill store={levaStore} titleBar={false} flat />{' '}
      </DraggablePanel>
    </div>
  );
};

export default React.memo(StroyBook);
