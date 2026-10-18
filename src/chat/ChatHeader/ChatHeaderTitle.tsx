import { type FC } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

import { chatChatHeaderClasses } from './stable';
import { titleStyles as styles } from './style';
import type { ChatHeaderTitleProps } from './type';

const ChatHeaderTitle: FC<ChatHeaderTitleProps> = ({ title, desc, tag }) => {
  const tagContent = tag && (
    <Flexbox horizontal align={'baseline'} className={chatChatHeaderClasses('tag')} flex={'none'}>
      {tag}
    </Flexbox>
  );

  if (desc)
    return (
      <Flexbox flex={1} {...styleProps(styles.container, chatChatHeaderClasses('title'))} gap={4}>
        <Flexbox
          horizontal
          align={'center'}
          flex={1}
          {...styleProps(styles.titleContainer)}
          gap={8}
        >
          <div {...styleProps(styles.titleWithDesc, chatChatHeaderClasses('title-text'))}>
            {title}
          </div>
          {tagContent}
        </Flexbox>
        <Flexbox
          horizontal
          align={'center'}
          width={'100%'}
          {...styleProps(styles.desc, chatChatHeaderClasses('desc'))}
        >
          {desc}
        </Flexbox>
      </Flexbox>
    );
  return (
    <Flexbox
      horizontal
      align={'center'}
      flex={1}
      {...styleProps(styles.container, chatChatHeaderClasses('title'))}
      gap={8}
    >
      <div {...styleProps(styles.title, chatChatHeaderClasses('title-text'))}>{title}</div>
      {tagContent}
    </Flexbox>
  );
};

export default ChatHeaderTitle;
