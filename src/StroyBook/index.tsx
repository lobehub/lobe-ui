import { useResponsive } from 'antd-style';
import { LevaPanel, useControls, useCreateStore } from 'leva';
import { memo } from 'react';

import { DivProps } from '@/types';

import DraggablePanel from '../DraggablePanel';
import { useStyles } from './style';

export { useControls, useCreateStore };
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

export const StroyBook = memo<StroyBookProps>(
  ({ levaStore, noPadding, className, children, ...props }) => {
    const { mobile } = useResponsive();
    const { styles, cx } = useStyles(Boolean(noPadding));

    return (
      <div className={cx(styles.editor, className)} {...props}>
        <div className={styles.left}>{children}</div>
        <DraggablePanel
          className={styles.right}
          minWidth={280}
          placement={mobile ? 'bottom' : 'right'}
        >
          <div className={styles.leva}>
            <LevaPanel fill flat store={levaStore} titleBar={false} />{' '}
          </div>
        </DraggablePanel>
      </div>
    );
  },
);

export default StroyBook;
