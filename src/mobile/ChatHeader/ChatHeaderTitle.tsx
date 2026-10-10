'use client';

import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { Flexbox } from '@/Flex';

import { titleStyles as styles } from './style';
import type { ChatHeaderTitleProps } from './type';

const ChatHeaderTitle = memo<ChatHeaderTitleProps>(({ title, desc, tag }) => {
  if (desc)
    return (
      <Flexbox align={'center'} flex={1} gap={4} justify={'center'}>
        <Flexbox horizontal align={'center'} flex={1} gap={4}>
          <div {...stylex.props(styles.titleWithDesc)}>{title}</div>
          {tag && (
            <Flexbox horizontal flex={'none'}>
              {tag}
            </Flexbox>
          )}
        </Flexbox>
        <Flexbox horizontal align={'center'}>
          <div {...stylex.props(styles.desc)}>{desc}</div>
        </Flexbox>
      </Flexbox>
    );
  return (
    <Flexbox horizontal align={'center'} flex={1} gap={4} justify={'center'}>
      <div {...stylex.props(styles.title)}>{title}</div>
      <Flexbox horizontal flex={'none'}>
        {tag}
      </Flexbox>
    </Flexbox>
  );
});

ChatHeaderTitle.displayName = 'ChatHeaderTitle';

export default ChatHeaderTitle;
