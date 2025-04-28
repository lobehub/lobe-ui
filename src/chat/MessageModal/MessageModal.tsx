'use client';

import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import Button from '@/Button';
import CodeEditor from '@/CodeEditor';
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
    onChange,
    text,
    footer,
    extra,
  }) => {
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
        destroyOnClose
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
          <CodeEditor
            className={textStyles}
            defaultValue={value}
            language={'markdown'}
            onValueChange={(value) => setMessage(value)}
            placeholder={placeholder}
            value={value}
            variant={'borderless'}
          />
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
