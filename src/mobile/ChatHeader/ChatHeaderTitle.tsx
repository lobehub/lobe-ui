'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';

import { useTitleStyles as useStyles } from './style';
import { ChatHeaderTitleProps } from './type';

const ChatHeaderTitle = memo<ChatHeaderTitleProps>(({ title, desc, tag }) => {
  const { styles } = useStyles();
  if (desc)
    return (
      <Flexbox align={'center'} flex={1} gap={4} justify={'center'}>
        <Flexbox align={'center'} className={styles.titleContainer} gap={4} horizontal>
          <div className={styles.titleWithDesc}>{title}</div>
          {tag && (
            <Flexbox className={styles.tag} horizontal>
              {tag}
            </Flexbox>
          )}
        </Flexbox>
        <Flexbox align={'center'} horizontal>
          <div className={styles.desc}>{desc}</div>
        </Flexbox>
      </Flexbox>
    );
  return (
    <Flexbox align={'center'} flex={1} gap={4} horizontal justify={'center'}>
      <div className={styles.title}>{title}</div>
      <Flexbox className={styles.tag} horizontal>
        {tag}
      </Flexbox>
    </Flexbox>
  );
});

ChatHeaderTitle.displayName = 'ChatHeaderTitle';

export default ChatHeaderTitle;
