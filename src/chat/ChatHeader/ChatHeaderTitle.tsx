import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useTitleStyles as useStyles } from './style';
import type { ChatHeaderTitleProps } from './type';

const ChatHeaderTitle = memo<ChatHeaderTitleProps>(({ title, desc, tag }) => {
  const { styles } = useStyles();

  const tagContent = tag && (
    <Flexbox align={'center'} className={styles.tag} horizontal>
      {tag}
    </Flexbox>
  );

  if (desc)
    return (
      <Flexbox className={styles.container} gap={4}>
        <Flexbox align={'center'} className={styles.titleContainer} gap={8} horizontal>
          <div className={styles.titleWithDesc}>{title}</div>
          {tagContent}
        </Flexbox>
        <Flexbox align={'center'} className={styles.desc} horizontal>
          {desc}
        </Flexbox>
      </Flexbox>
    );
  return (
    <Flexbox align={'center'} className={styles.container} gap={8} horizontal>
      <div className={styles.title}>{title}</div>
      {tagContent}
    </Flexbox>
  );
});

export default ChatHeaderTitle;
