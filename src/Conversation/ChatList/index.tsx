import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { CSSProperties, FC, memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { useStore } from '@/Chat/store';

import MessageItem from './MessageItem';

const useStyles = createStyles(({ css, token }) => ({
  btn: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
    background: transparent;
    border: 2px solid ${token.colorBorderSecondary} !important;
  `,
  loading: css`
    padding: 12px;
    background: ${token.colorFillQuaternary};
    border-radius: 8px;
  `,
}));

interface ChatListProps {
  /**
   * @title 是否包含系统消息
   */
  includeSystem?: boolean;
  /**
   * @title 是否只读
   */
  readonly?: boolean;
  style?: CSSProperties;
}

const ChatList: FC<ChatListProps> = memo(({ readonly, includeSystem = false, style }) => {
  // const [messages, loading] = useStore((s) => [s.messages, s.loading], isEqual);
  const { styles } = useStyles();
  const [messages, loading] = useStore((s) => [s.messages, s.loading], isEqual);

  return !messages || messages.length === 0 ? undefined : (
    <Flexbox gap={8} style={style}>
      {messages
        // 根据情况确认是否包含系统
        .filter((s) => (includeSystem ? Boolean(s) : s.role !== 'system'))
        .map((item, index: number) => (
          <MessageItem index={index} key={index} readonly={readonly} {...item} />
        ))}
      {loading ? (
        <Center className={styles.loading} id={'for-loading'}>
          <Flexbox align={'center'} distribution={'space-between'} gap={24} horizontal>
            <div></div>
            正在生成...
            <div></div>
            {/*<Button shape={'round'} className={styles.btn} size={'small'}>*/}
            {/*  停止*/}
            {/*</Button>*/}
          </Flexbox>
        </Center>
      ) : undefined}
    </Flexbox>
  );
});

export default ChatList;
