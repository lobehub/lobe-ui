import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Button, ButtonProps } from 'antd';
import { FC, memo } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/Chat/store';
import { ChatMessage } from '@/Chat/types';
import Markdown from '@/Markdown';
import MessageInput from '@/MessageInput';

export interface ContentProps extends Pick<ChatMessage, 'content' | 'role' | 'error'> {
  index: number;
  loading: boolean;
}

const Content: FC<ContentProps> = memo(({ content, role, index, error, loading }) => {
  const [editingMessageId, dispatchMessage, handleMessageEditing, resendMessage] = useStore(
    (s) => [s.editingMessageId, s.dispatchMessage, s.handleMessageEditing, s.resendMessage],
    shallow,
  );

  const isEditing = editingMessageId === index;

  const isUser = role === 'user';

  if (isEditing) {
    return (
      <MessageInput
        defaultValue={content}
        renderButtons={(text) =>
          [
            {
              children: isUser ? '更新并重新生成' : '更新',
              onClick: () => {
                dispatchMessage({ index, message: text, type: 'updateMessage' });
                handleMessageEditing();

                // 如果是用户的消息，那么重新生成下一条消息
                if (isUser) {
                  resendMessage(index + 1);
                }
              },
              type: 'primary',
            },
            isUser
              ? {
                  children: '仅更新',
                  onClick: () => {
                    dispatchMessage({ index, message: text, type: 'updateMessage' });
                    handleMessageEditing();
                  },
                }
              : undefined,
            {
              children: '取消',
              onClick: () => handleMessageEditing(),
              type: 'text',
            },
          ].filter(Boolean) as ButtonProps[]
        }
      />
    );
  }

  return (
    <>
      {loading ? (
        error ? undefined : (
          <div>
            <LoadingOutlined spin style={{ fontSize: 20 }} />
          </div>
        )
      ) : (
        <Markdown>{content}</Markdown>
      )}
      {error && (
        <Alert
          action={<Button onClick={() => resendMessage(index)}>重试</Button>}
          description={
            error.type === 'openai' ? (
              <div>
                {error.message} （错误码：<code>{error.status}</code>，详情可查看{' '}
                <a
                  href="https://platform.openai.com/docs/guides/error-codes"
                  rel="noreferrer"
                  target={'_blank'}
                >
                  官方文档
                </a>
                ）
              </div>
            ) : (
              error.message
            )
          }
          message={
            error.type === 'openai'
              ? `请求 OpenAI 服务出错`
              : `会话出错啦（错误码 ${error.status}）`
          }
          showIcon
          style={{ marginTop: 12 }}
          type={'error'}
        />
      )}
    </>
  );
});

export default Content;
