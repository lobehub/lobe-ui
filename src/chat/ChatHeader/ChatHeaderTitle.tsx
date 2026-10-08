import * as stylex from '@stylexjs/stylex';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';

import { titleStyles as styles } from './style';
import type { ChatHeaderTitleProps } from './type';

const ChatHeaderTitle: FC<ChatHeaderTitleProps> = ({ title, desc, tag }) => {
  const tagContent = tag && (
    <Flexbox horizontal align={'center'} {...stylex.props(styles.tag)}>
      {tag}
    </Flexbox>
  );

  if (desc)
    return (
      <Flexbox {...stylex.props(styles.container)} gap={4}>
        <Flexbox horizontal align={'center'} {...stylex.props(styles.titleContainer)} gap={8}>
          <div {...stylex.props(styles.titleWithDesc)}>{title}</div>
          {tagContent}
        </Flexbox>
        <Flexbox horizontal align={'center'} {...stylex.props(styles.desc)}>
          {desc}
        </Flexbox>
      </Flexbox>
    );
  return (
    <Flexbox horizontal align={'center'} {...stylex.props(styles.container)} gap={8}>
      <div {...stylex.props(styles.title)}>{title}</div>
      {tagContent}
    </Flexbox>
  );
};

export default ChatHeaderTitle;
