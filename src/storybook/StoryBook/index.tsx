'use client';

import { cx, useResponsive } from 'antd-style';
import { LevaPanel } from 'leva';
import { memo, type Ref } from 'react';

import DraggablePanel from '@/DraggablePanel';
import { Center, Flexbox, type FlexboxProps } from '@/Flex';

import { styles } from './style';

export interface StoryBookProps extends FlexboxProps {
  levaStore: any;
  noPadding?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export const StoryBook = memo<StoryBookProps>(
  ({ ref, levaStore, noPadding, className, children, ...rest }) => {
    const { mobile } = useResponsive();

    return (
      <Flexbox
        align={'stretch'}
        className={cx(styles.editor, className)}
        horizontal={!mobile}
        justify={'stretch'}
        ref={ref}
      >
        <Center className={cx(noPadding ? styles.left : styles.leftWithPadding)} flex={1} {...rest}>
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

StoryBook.displayName = 'StoryBook';

export default StoryBook;

export { useControls, useCreateStore } from 'leva';
