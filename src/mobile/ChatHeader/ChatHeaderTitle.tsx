'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

import { mobileChatHeaderClasses } from './stable';
import { titleStyles as styles } from './style';
import type { ChatHeaderTitleProps } from './type';

const ChatHeaderTitle = memo<ChatHeaderTitleProps>(({ title, desc, tag }) => {
  if (desc)
    return (
      <Flexbox
        align={'center'}
        className={mobileChatHeaderClasses('title')}
        flex={1}
        gap={4}
        justify={'center'}
      >
        <Flexbox horizontal align={'center'} flex={1} gap={4}>
          <div {...styleProps(styles.titleWithDesc, mobileChatHeaderClasses('title-text'))}>
            {title}
          </div>
          {tag && (
            <Flexbox horizontal className={mobileChatHeaderClasses('tag')} flex={'none'}>
              {tag}
            </Flexbox>
          )}
        </Flexbox>
        <Flexbox horizontal align={'center'}>
          <div {...styleProps(styles.desc, mobileChatHeaderClasses('desc'))}>{desc}</div>
        </Flexbox>
      </Flexbox>
    );
  return (
    <Flexbox
      horizontal
      align={'center'}
      className={mobileChatHeaderClasses('title')}
      flex={1}
      gap={4}
      justify={'center'}
    >
      <div {...styleProps(styles.title, mobileChatHeaderClasses('title-text'))}>{title}</div>
      <Flexbox horizontal className={mobileChatHeaderClasses('tag')} flex={'none'}>
        {tag}
      </Flexbox>
    </Flexbox>
  );
});

ChatHeaderTitle.displayName = 'ChatHeaderTitle';

export default ChatHeaderTitle;
