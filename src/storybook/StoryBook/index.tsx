'use client';

import { useResponsive } from 'antd-style';
import { LevaPanel } from 'leva';
import { forwardRef } from 'react';
import { Center, Flexbox, FlexboxProps } from 'react-layout-kit';

import DraggablePanel from '@/DraggablePanel';

import { useStyles } from './style';

export interface StoryBookProps extends FlexboxProps {
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

export const StoryBook = forwardRef<HTMLDivElement, StoryBookProps>(
  ({ levaStore, noPadding, className, children, ...rest }, ref) => {
    const { mobile } = useResponsive();
    const { styles, cx } = useStyles(Boolean(noPadding));

    return (
      <Flexbox
        align={'stretch'}
        className={cx(styles.editor, className)}
        horizontal={!mobile}
        justify={'stretch'}
        ref={ref}
      >
        <Center className={styles.left} flex={1} {...rest}>
          {children}
        </Center>
        <DraggablePanel
          className={styles.right}
          minWidth={280}
          placement={mobile ? 'bottom' : 'right'}
        >
          <div className={styles.leva}>
            <LevaPanel fill flat store={levaStore} titleBar={false} />{' '}
          </div>
        </DraggablePanel>
      </Flexbox>
    );
  },
);

export default StoryBook;

export { useControls, useCreateStore } from 'leva';
