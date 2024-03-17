'use client';

import { Button } from 'antd';
import { useResponsive } from 'antd-style';
import { CSSProperties, ReactNode, memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import { TextArea } from '@/Input';
import Markdown from '@/Markdown';
import { type MessageInputProps } from '@/MessageInput';
import { useStyles as useTextStyles } from '@/MessageInput/style';
import Modal, { type ModalProps } from '@/Modal';

export interface MessageModalProps extends Pick<ModalProps, 'open' | 'footer'> {
  /**
   * @description Whether the message is being edited or not
   * @default false
   */
  editing?: boolean;
  extra?: ReactNode;
  height?: MessageInputProps['height'];
  /**
   * @description Callback fired when message content is changed
   */
  onChange?: (text: string) => void;
  /**
   * @description Callback fired when editing state is changed
   */
  onEditingChange?: (editing: boolean) => void;
  /**
   * @description Callback fired when open state is changed
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * @description Whether the modal is open or not
   * @default false
   */
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

const MessageModal = memo<MessageModalProps>(
  ({
    editing,
    open,
    height = 'auto',
    onOpenChange,
    onEditingChange,
    placeholder,
    value,
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

    const [temporaryValue, setValue] = useState(value);

    const isAutoSize = height === 'auto';
    const markdownStyle: CSSProperties = {
      height: isAutoSize ? 'unset' : height,
      overflowX: 'hidden',
      overflowY: 'auto',
    };

    const modalFooter = isEdit ? (
      <Flexbox direction={'horizontal-reverse'} gap={8}>
        <Button
          onClick={() => {
            setTyping(false);
            onChange?.(temporaryValue);
            setValue(value);
          }}
          type="primary"
        >
          {text?.confirm || 'Confirm'}
        </Button>
        <Button
          onClick={() => {
            setTyping(false);
            setValue(value);
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
        okText={text?.edit || 'Edit'}
        onCancel={() => {
          setShowModal(false);
          setTyping(false);
          setValue(value);
        }}
        onOk={() => setTyping(true)}
        open={showModal}
        title={text?.title}
      >
        {isEdit ? (
          <TextArea
            autoSize={isAutoSize}
            className={textStyles}
            onBlur={(e) => setValue(e.target.value)}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            resize={false}
            style={{
              flex: mobile ? 1 : undefined,
              height: isAutoSize ? 'unset' : height,
              minHeight: mobile ? 'unset' : '100%',
            }}
            type={mobile ? 'pure' : 'block'}
            value={temporaryValue}
          />
        ) : (
          <>
            {extra}
            <Markdown
              style={value ? markdownStyle : { ...markdownStyle, opacity: 0.5 }}
              variant={'chat'}
            >
              {String(value || placeholder)}
            </Markdown>
          </>
        )}
      </Modal>
    );
  },
);

export default MessageModal;
