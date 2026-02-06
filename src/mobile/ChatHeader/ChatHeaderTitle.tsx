'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';

import { titleStyles as styles } from './style';
import type { ChatHeaderTitleProps } from './type';

const ChatHeaderTitle = memo<ChatHeaderTitleProps>(({ title, desc, tag }) => {
  if (desc)
    return (
      <Flexbox align={'center'} flex={1} gap={4} justify={'center'}>
        <Flexbox horizontal align={'center'} className={styles.titleContainer} gap={4}>
          <div className={styles.titleWithDesc}>{title}</div>
          {tag && (
            <Flexbox horizontal className={styles.tag}>
              {tag}
            </Flexbox>
          )}
        </Flexbox>
        <Flexbox horizontal align={'center'}>
          <div className={styles.desc}>{desc}</div>
        </Flexbox>
      </Flexbox>
    );
  return (
    <Flexbox horizontal align={'center'} flex={1} gap={4} justify={'center'}>
      <div className={styles.title}>{title}</div>
      <Flexbox horizontal className={styles.tag}>
        {tag}
      </Flexbox>
    </Flexbox>
  );
});

ChatHeaderTitle.displayName = 'ChatHeaderTitle';

export default ChatHeaderTitle;
