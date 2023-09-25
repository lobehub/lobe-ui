import { Button, Select } from 'antd';
import isEqual from 'fast-deep-equal';
import { Plus, Trash } from 'lucide-react';
import { memo, useEffect, useReducer } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import Icon from '@/Icon';
import { ControlInput } from '@/components/ControlInput';
import { LLMMessage } from '@/types/llm';

import { messagesReducer } from './messageReducer';

export interface EditableMessageListProps {
  /**
   * @description The data sources to be rendered
   */
  dataSources: LLMMessage[];
  /**
   * @description Whether the component is disabled or not
   * @default false
   */
  disabled?: boolean;
  /**
   * @description Callback function triggered when the data sources are changed
   * @param chatMessages - the updated data sources
   */
  onChange?: (chatMessages: LLMMessage[]) => void;
}

export const EditableMessageList = memo<EditableMessageListProps>(
  ({ disabled, dataSources, onChange }) => {
    const [chatMessages, dispatch] = useReducer(messagesReducer, dataSources);

    useEffect(() => {
      if (!isEqual(dataSources, chatMessages)) {
        onChange?.(chatMessages);
      }
    }, [chatMessages]);

    return dataSources ? (
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
                dispatch({ index, role: value, type: 'updateMessageRole' });
              }}
              options={[
                { label: 'System', value: 'system' },
                { label: 'Input', value: 'user' },
                { label: 'Output', value: 'assistant' },
              ]}
              style={{ width: 120 }}
              value={item.role}
            />
            <ControlInput
              disabled={disabled}
              onChange={(e) => {
                dispatch({ index, message: e, type: 'updateMessage' });
              }}
              placeholder={item.role === 'user' ? '请填入输入的样例内容' : '请填入输出的样例'}
              value={item.content}
            />
            <ActionIcon
              icon={Trash}
              onClick={() => {
                dispatch({ index, type: 'deleteMessage' });
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
              message: { content: '', role: lastMeg?.role === 'user' ? 'assistant' : 'user' },
              type: 'addMessage',
            });
          }}
        >
          Add Props
        </Button>
      </Flexbox>
    ) : null;
  },
  isEqual,
);

export default EditableMessageList;
