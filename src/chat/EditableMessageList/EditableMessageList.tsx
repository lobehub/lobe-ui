'use client';

import isEqual from 'fast-deep-equal';
import { Plus, Trash } from 'lucide-react';
import { memo, useEffect, useReducer } from 'react';

import ActionIcon from '@/ActionIcon';
import Button from '@/Button';
import ControlInput from '@/EditableText/ControlInput';
import { Flexbox } from '@/Flex';
import editableMessageMessages from '@/i18n/resources/en/editableMessage';
import { useTranslation } from '@/i18n/useTranslation';
import Select from '@/Select';

import { messagesReducer } from './messageReducer';
import { type EditableMessageListProps } from './type';

const EditableMessageList = memo<EditableMessageListProps>(
  ({ disabled, dataSources, onChange, texts }) => {
    const [chatMessages, dispatch] = useReducer(messagesReducer, dataSources);
    const { t } = useTranslation(editableMessageMessages);

    const addPropsText = texts?.addProps ?? t('editableMessage.addProps');
    const deleteText = texts?.delete ?? t('editableMessage.delete');
    const inputPlaceholderText = texts?.inputPlaceholder ?? t('editableMessage.inputPlaceholder');
    const outputPlaceholderText =
      texts?.outputPlaceholder ?? t('editableMessage.outputPlaceholder');
    const systemText = texts?.system ?? t('editableMessage.system');
    const inputText = texts?.input ?? t('editableMessage.input');
    const outputText = texts?.output ?? t('editableMessage.output');

    useEffect(() => {
      if (!isEqual(dataSources, chatMessages)) {
        onChange?.(chatMessages);
      }
    }, [chatMessages]);

    return dataSources ? (
      <Flexbox gap={12}>
        {chatMessages.map((item, index) => (
          <Flexbox
            horizontal
            align={'center'}
            gap={8}
            key={`${index}-${item.content}`}
            width={'100%'}
          >
            <Select
              disabled={disabled}
              style={{ width: 120 }}
              styles={{ popup: { root: { zIndex: 100 } } }}
              value={item.role}
              options={[
                { label: systemText, value: 'system' },
                { label: inputText, value: 'user' },
                { label: outputText, value: 'assistant' },
              ]}
              onChange={(value) => {
                dispatch({ index, role: value, type: 'updateMessageRole' });
              }}
            />
            <ControlInput
              disabled={disabled}
              placeholder={item.role === 'user' ? inputPlaceholderText : outputPlaceholderText}
              value={item.content}
              onChange={(e) => {
                dispatch({ index, message: e, type: 'updateMessage' });
              }}
            />
            <ActionIcon
              icon={Trash}
              title={deleteText}
              variant={'filled'}
              onClick={() => {
                dispatch({ index, type: 'deleteMessage' });
              }}
            />
          </Flexbox>
        ))}

        <Button
          block
          disabled={disabled}
          icon={Plus}
          onClick={() => {
            const lastMeg = chatMessages.at(-1);

            dispatch({
              message: { content: '', role: lastMeg?.role === 'user' ? 'assistant' : 'user' },
              type: 'addMessage',
            });
          }}
        >
          {addPropsText}
        </Button>
      </Flexbox>
    ) : undefined;
  },
  isEqual,
);

EditableMessageList.displayName = 'EditableMessageList';

export default EditableMessageList;
