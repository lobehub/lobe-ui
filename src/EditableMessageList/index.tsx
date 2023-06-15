import { Button, Select } from 'antd';
import isEqual from 'fast-deep-equal';
import { Plus, Trash } from 'lucide-react';
import { memo, useEffect, useReducer } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatMessage, messagesReducer } from '@/Chat';
import { ControlInput } from '@/components/ControlInput';
import { ActionIcon, Icon } from '@/index';

export interface EditableMessageListProps {
  /**
   * @description The data sources to be rendered
   */
  dataSources: ChatMessage[];
  /**
   * @description Whether the component is disabled or not
   * @default false
   */
  disabled?: boolean;
  /**
   * @description Callback function triggered when the data sources are changed
   * @param chatMessages - the updated data sources
   */
  onChange?: (chatMessages: ChatMessage[]) => void;
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
            align={'center'}
            gap={8}
            horizontal
            key={`${index}-${item.content}`}
            width={'100%'}
          >
            <Select
              disabled={disabled}
              dropdownStyle={{ zIndex: 100 }}
              onChange={(value) => {
                dispatch({ type: 'updateMessageRole', index, role: value });
              }}
              options={[
                { value: 'system', label: 'System' },
                { value: 'user', label: 'Input' },
                { value: 'assistant', label: 'Output' },
              ]}
              style={{ width: 120 }}
              value={item.role}
            />
            <ControlInput
              disabled={disabled}
              onChange={(e) => {
                dispatch({ type: 'updateMessage', index, message: e });
              }}
              placeholder={item.role === 'user' ? '请填入输入的样例内容' : '请填入输出的样例'}
              value={item.content}
            />
            <ActionIcon
              icon={Trash}
              onClick={() => {
                dispatch({ type: 'deleteMessage', index });
              }}
              placement="right"
              size={{ fontSize: 16 }}
              title="Delete"
            />
          </Flexbox>
        ))}

        <Button
          block
          disabled={disabled}
          icon={<Icon icon={Plus} />}
          onClick={() => {
            const lastMeg = chatMessages.at(-1);

            dispatch({
              type: 'addMessage',
              message: { role: lastMeg?.role === 'user' ? 'assistant' : 'user', content: '' },
            });
          }}
        >
          Add Props
        </Button>
      </Flexbox>
    );
  },
  isEqual,
);

export default EditableMessageList;
