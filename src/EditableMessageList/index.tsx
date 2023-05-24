import { PlusOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import isEqual from 'fast-deep-equal';
import { memo, useEffect, useReducer } from 'react';
import { Flexbox } from 'react-layout-kit';

import IconAction from '@/ActionIcon';
import { ChatMessage, messagesReducer } from '@/Chat';
import { ControlInput } from '@/components/ControlInput';

import { TrashIcon } from 'lucide-react';

export interface EditableMessageListProps {
  dataSources: ChatMessage[];
  onChange?: (chatMessages: ChatMessage[]) => void;
  disabled?: boolean;
}

export const EditableMessageList = memo<EditableMessageListProps>(
  ({ disabled, dataSources, onChange }) => {
    const [chatMessages, dispatch] = useReducer(messagesReducer, dataSources);

    useEffect(() => {
      if (!isEqual(dataSources, chatMessages)) {
        onChange?.(chatMessages);
      }
    }, [chatMessages]);

    return !dataSources ? null : (
      <Flexbox gap={12}>
        {chatMessages.map((item, index) => (
          <Flexbox
            horizontal
            gap={8}
            width={'100%'}
            align={'center'}
            key={`${index}-${item.content}`}
          >
            <Select
              value={item.role}
              style={{ width: 120 }}
              dropdownStyle={{ zIndex: 100 }}
              disabled={disabled}
              onChange={(value) => {
                dispatch({ type: 'updateMessageRole', index, role: value });
              }}
              options={[
                { value: 'system', label: '系统' },
                { value: 'user', label: '输入' },
                { value: 'assistant', label: '输出' },
              ]}
            />
            <ControlInput
              disabled={disabled}
              value={item.content}
              onChange={(e) => {
                dispatch({ type: 'updateMessage', index, message: e });
              }}
              placeholder={item.role === 'user' ? '请填入输入的样例内容' : '请填入输出的样例'}
            />
            <IconAction
              icon={TrashIcon}
              title={'删除'}
              size={'small'}
              onClick={() => {
                dispatch({ type: 'deleteMessage', index });
              }}
            />
          </Flexbox>
        ))}

        <Button
          block
          disabled={disabled}
          icon={<PlusOutlined />}
          onClick={() => {
            const lastMeg = chatMessages.at(-1);

            dispatch({
              type: 'addMessage',
              message: { role: lastMeg?.role === 'user' ? 'assistant' : 'user', content: '' },
            });
          }}
        >
          添加一项
        </Button>
      </Flexbox>
    );
  },
  isEqual,
);

export default EditableMessageList;
