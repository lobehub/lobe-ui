import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { CSSProperties, FC, memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { useStore } from '@/Chat/store';
import MessageItem from './MessageItem';

const useStyles = createStyles(({ css, token }) => ({
  loading: css`
    padding: 12px;
    background: ${token.colorFillQuaternary};
    border-radius: 8px;
  `,
  btn: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
    background: transparent;
    border: 2px solid ${token.colorBorderSecondary} !important;
  `,
}));

interface ChatListProps {
  /**
   * @title 是否只读
   */
  readonly?: boolean;
  /**
   * @title 是否包含系统消息
   */
  includeSystem?: boolean;
  style?: CSSProperties;
}

const ChatList: FC<ChatListProps> = memo(({ readonly, includeSystem = false, style }) => {
  // const [messages, loading] = useStore((s) => [s.messages, s.loading], isEqual);
  const { styles } = useStyles();
  const [messages, loading] = useStore((s) => [s.messages, s.loading], isEqual);

  return !messages || messages.length === 0 ? null : (
    <Flexbox gap={8} style={style}>
      {messages
        // 根据情况确认是否包含系统
        .filter((s) => (!includeSystem ? s.role !== 'system' : !!s))
        .map((item, index: number) => (
          <MessageItem readonly={readonly} index={index} key={index} {...item} />
        ))}
      {loading ? (
        <Center id={'for-loading'} className={styles.loading}>
          <Flexbox horizontal distribution={'space-between'} align={'center'} gap={24}>
            <div></div>
            正在生成...
            <div></div>
            {/*<Button shape={'round'} className={styles.btn} size={'small'}>*/}
            {/*  停止*/}
            {/*</Button>*/}
          </Flexbox>
        </Center>
      ) : null}
    </Flexbox>
  );
});

export default ChatList;
