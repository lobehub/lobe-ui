import { Typography } from 'antd';
import isEqual from 'fast-deep-equal';
import { FC, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useStore } from '@/Chat/store';

import ChatList from './ChatList';
import InputArea from './InputArea';

export interface AppProps {
  /**
   * @description Whether to include system messages in the chat.
   * @default true
   */
  includeSystem?: boolean;
  /**
   * @description Whether the component is in readonly mode.
   * @default false
   */
  readonly?: boolean;
}

const ChatContainer: FC<AppProps> = ({ readonly, includeSystem = true }) => {
  const [showInput, title, description] = useStore(
    (s) => [!s.changingSystemRole, s.title, s.description],
    isEqual,
  );

  if (readonly) return <ChatList includeSystem={includeSystem} readonly />;

  return (
    <Flexbox gap={24} height={'100%'} width={'100%'}>
      {title || description ? (
        <Flexbox>
          <Typography.Title level={4}>{title}</Typography.Title>
          <Typography.Text type={'secondary'}>{description}</Typography.Text>
        </Flexbox>
      ) : undefined}
      <ChatList includeSystem={includeSystem} />
      {showInput ? <InputArea /> : undefined}
    </Flexbox>
  );
};

export default memo(ChatContainer);
