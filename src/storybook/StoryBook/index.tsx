'use client';

import { FlexboxProps } from '@lobehub/ui/Flex';
import { useResponsive } from 'antd-style';
import { LevaPanel } from 'leva';
import { Ref, memo } from 'react';

import DraggablePanel from '@/DraggablePanel';
import { Center, Flexbox } from '@/Flex';

import { useStyles } from './style';

export interface StoryBookProps extends FlexboxProps {
  levaStore: any;
  noPadding?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export const StoryBook = memo<StoryBookProps>(
  ({ ref, levaStore, noPadding, className, children, ...rest }) => {
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

StoryBook.displayName = 'StoryBook';

export default StoryBook;

export { useControls, useCreateStore } from 'leva';
