'use client';

import { useResponsive } from 'antd-style';
import { memo, useState } from 'react';
import useControlledState from 'use-merge-value';

import Button from '@/Button';
import CodeEditor from '@/CodeEditor';
import { Flexbox } from '@/Flex';
import TextArea from '@/Input/TextArea';
import Markdown from '@/Markdown';
import Modal from '@/Modal';
import { useStyles as useTextStyles } from '@/chat/MessageInput/style';

import type { MessageModalProps } from './type';

const MessageModal = memo<MessageModalProps>(
  ({
    panelRef,
    editing,
    open,
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
    const { styles: textStyles } = useTextStyles();
    const [isEdit, setTyping] = useControlledState(false, {
      onChange: onEditingChange,
      value: editing,
    });

    const [showModal, setShowModal] = useControlledState(false, {
      onChange: onOpenChange,
      value: open,
    });

    const [temporaryValue, setMessage] = useState(value);

    const modalFooter = isEdit ? (
      <Flexbox direction={'horizontal-reverse'} gap={8}>
        <Button
          onClick={() => {
            setTyping(false);
            onChange?.(temporaryValue);
            setMessage(value);
          }}
          type="primary"
        >
          {text?.confirm || 'Confirm'}
        </Button>
        <Button
          onClick={() => {
            setTyping(false);
            setMessage(value);
          }}
        >
          {text?.cancel || 'Cancel'}
        </Button>
      </Flexbox>
    ) : (
      footer
    );

    return (
      <Modal
        allowFullscreen
        cancelText={text?.cancel || 'Cancel'}
        destroyOnHidden
        footer={modalFooter}
        height={height}
        okText={text?.edit || 'Edit'}
        onCancel={() => {
          setShowModal(false);
          setTyping(false);
          setMessage(value);
        }}
        onOk={() => setTyping(true)}
        open={showModal}
        panelRef={panelRef}
        title={text?.title}
      >
        {isEdit ? (
          mobile ? (
            <TextArea
              autoSize
              className={textStyles}
              defaultValue={temporaryValue}
              onBlur={(e) => setMessage(e.target.value)}
              onChange={(value) => setMessage(value.target.value)}
              placeholder={placeholder}
              value={temporaryValue}
              variant={'borderless'}
            />
          ) : (
            <CodeEditor
              className={textStyles}
              defaultValue={temporaryValue}
              language={language}
              onBlur={(e) => setMessage(e.target.value)}
              onValueChange={(value) => setMessage(value)}
              placeholder={placeholder}
              value={temporaryValue}
              variant={'borderless'}
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
