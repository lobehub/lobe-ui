import { createStyles, useResponsive } from 'antd-style';
import { CSSProperties, ReactNode, memo } from 'react';
import useControlledState from 'use-merge-value';

import Markdown from '@/Markdown';
import MessageInput, { type MessageInputProps } from '@/MessageInput';
import Modal, { type ModalProps } from '@/Modal';

const useStyles = createStyles(({ stylish }) => ({
  markdown: stylish.markdownInChat,
}));

export interface MessageModalProps extends Pick<ModalProps, 'open' | 'footer'> {
  defaultValue?: string;
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
    defaultValue,
    extra,
  }) => {
    const { mobile } = useResponsive();
    const { styles } = useStyles();

    const [isEdit, setTyping] = useControlledState(false, {
      onChange: onEditingChange,
      value: editing,
    });

    const [showModal, setShowModal] = useControlledState(false, {
      onChange: onOpenChange,
      value: open,
    });

    const isAutoSize = height === 'auto';
    const markdownStyle: CSSProperties = {
      height: isAutoSize ? 'unset' : height,
      overflowX: 'hidden',
      overflowY: 'auto',
    };

    return (
      <Modal
        allowFullscreen
        cancelText={text?.cancel || 'Cancel'}
        destroyOnClose
        footer={isEdit ? null : footer}
        okText={text?.edit || 'Edit'}
        onCancel={() => {
          setShowModal(false);
          setTyping(false);
        }}
        onOk={() => setTyping(true)}
        open={showModal}
        title={text?.title}
      >
        {showModal && isEdit ? (
          <MessageInput
            defaultValue={defaultValue || value}
            height={height}
            onCancel={() => setTyping(false)}
            onConfirm={(text) => {
              setTyping(false);
              onChange?.(text);
            }}
            placeholder={placeholder}
            style={mobile ? { height: '100%' } : {}}
            text={{
              cancel: text?.cancel,
              confirm: text?.confirm,
            }}
            textareaStyle={mobile ? { flex: 1, minHeight: 'unset' } : {}}
            type={mobile ? 'pure' : 'block'}
          />
        ) : (
          <>
            {extra}
            <Markdown
              className={styles.markdown}
              style={value ? markdownStyle : { ...markdownStyle, opacity: 0.5 }}
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
