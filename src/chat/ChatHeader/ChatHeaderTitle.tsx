import { type FC } from 'react';

import { Flexbox } from '@/Flex';

import { titleStyles as styles } from './style';
import type { ChatHeaderTitleProps } from './type';

const ChatHeaderTitle: FC<ChatHeaderTitleProps> = ({ title, desc, tag }) => {
  const tagContent = tag && (
    <Flexbox horizontal align={'center'} className={styles.tag}>
      {tag}
    </Flexbox>
  );

  if (desc)
    return (
      <Flexbox className={styles.container} gap={4}>
        <Flexbox horizontal align={'center'} className={styles.titleContainer} gap={8}>
          <div className={styles.titleWithDesc}>{title}</div>
          {tagContent}
        </Flexbox>
        <Flexbox horizontal align={'center'} className={styles.desc}>
          {desc}
        </Flexbox>
      </Flexbox>
    );
  return (
    <Flexbox horizontal align={'center'} className={styles.container} gap={8}>
      <div className={styles.title}>{title}</div>
      {tagContent}
    </Flexbox>
  );
};

export default ChatHeaderTitle;
