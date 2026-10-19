'use client';

import clsx from 'clsx';
import { memo, useState } from 'react';

import Button from '@/Button';
import { styles as textStyles } from '@/chat/MessageInput/style';
import CodeEditor from '@/CodeEditor';
import { Flexbox } from '@/Flex';
import { useControlledState } from '@/hooks/useControlledState';
import messageModalMessages from '@/i18n/resources/en/messageModal';
import { useTranslation } from '@/i18n/useTranslation';
import { TextArea } from '@/Input';
import Markdown from '@/Markdown';
import { Modal } from '@/Modal';
import { useResponsive } from '@/styles/theme/scope';

import { chatMessageModalClasses } from './stable';
import { type MessageModalProps } from './type';

const MessageModal = memo<MessageModalProps>(
  ({
    editing,
    open,
    className,
    height = '75vh',
    onOpenChange,
    onEditingChange,
    placeholder,
    value,
    language = 'markdown',
    onChange,
    text,
    footer,
    extra,
  }) => {
    const { mobile } = useResponsive();
    const { t } = useTranslation(messageModalMessages);
    const [isEdit, setTyping] = useControlledState(false, {
      onChange: onEditingChange,
      value: editing,
    });

    const [showModal, setShowModal] = useControlledState(false, {
      onChange: onOpenChange,
      value: open,
    });

    const [temporaryValue, setMessage] = useState(value);

    const confirmText = text?.confirm ?? t('messageModal.confirm');
    const cancelText = text?.cancel ?? t('messageModal.cancel');
    const editText = text?.edit ?? t('messageModal.edit');

    const modalFooter = isEdit ? (
      <Flexbox
        className={chatMessageModalClasses('actions')}
        direction={'horizontal-reverse'}
        gap={8}
      >
        <Button
          className={chatMessageModalClasses('confirm')}
          type="primary"
          onClick={() => {
            setTyping(false);
            onChange?.(temporaryValue);
            setMessage(value);
          }}
        >
          {confirmText}
        </Button>
        <Button
          className={chatMessageModalClasses('cancel')}
          onClick={() => {
            setTyping(false);
            setMessage(value);
          }}
        >
          {cancelText}
        </Button>
      </Flexbox>
    ) : (
      footer
    );

    return (
      <Modal
        allowFullscreen
        destroyOnHidden
        cancelText={cancelText}
        className={clsx(chatMessageModalClasses(), className)}
        footer={modalFooter}
        height={height}
        okText={editText}
        open={showModal}
        title={text?.title}
        onOk={() => setTyping(true)}
        onCancel={() => {
          setShowModal(false);
          setTyping(false);
          setMessage(value);
        }}
      >
        {isEdit ? (
          mobile ? (
            <TextArea
              autoSize
              className={clsx(chatMessageModalClasses('editor'), textStyles)}
              defaultValue={temporaryValue}
              placeholder={placeholder}
              value={temporaryValue}
              variant={'borderless'}
              onBlur={(e) => setMessage(e.target.value)}
              onChange={(value) => setMessage(value.target.value)}
            />
          ) : (
            <CodeEditor
              className={clsx(chatMessageModalClasses('editor'), textStyles)}
              defaultValue={temporaryValue}
              language={language}
              placeholder={placeholder}
              value={temporaryValue}
              variant={'borderless'}
              onBlur={(e) => setMessage(e.target.value)}
              onValueChange={(value) => setMessage(value)}
            />
          )
        ) : (
          <>
            {extra}
            <Markdown variant={'chat'}>{String(value || placeholder)}</Markdown>
          </>
        )}
      </Modal>
    );
  },
);

MessageModal.displayName = 'MessageModal';

export default MessageModal;
