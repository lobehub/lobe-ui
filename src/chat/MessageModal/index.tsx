'use client';

import { ReactNode, forwardRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import Button from '@/Button';
import CodeEditor from '@/CodeEditor';
import Markdown from '@/Markdown';
import Modal, { type ModalProps } from '@/Modal';
import { type MessageInputProps } from '@/chat/MessageInput';
import { useStyles as useTextStyles } from '@/chat/MessageInput/style';

export interface MessageModalProps extends Pick<ModalProps, 'open' | 'footer'> {
  editing?: boolean;
  extra?: ReactNode;
  height?: MessageInputProps['height'];
  onChange?: (text: string) => void;
  onEditingChange?: (editing: boolean) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  text?: {
    cancel?: string;
    confirm?: string;
    edit?: string;
    title?: string;
  };
  /**
   * @description The value of the message content
   */
  value: string;
}

const MessageModal = forwardRef<HTMLDivElement, MessageModalProps>(
  (
    {
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
    },
    ref,
  ) => {
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
        ref={ref}
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
