import { createStyles, useResponsive } from 'antd-style';
import { CSSProperties, ReactNode, memo, useState } from 'react';
import useControlledState from 'use-merge-value';

import Markdown from '@/Markdown';
import MessageInput, { type MessageInputProps } from '@/MessageInput';
import MessageInputFooter from '@/MessageInput/MessageInputFooter';
import Modal, { type ModalProps } from '@/Modal';

const useStyles = createStyles(({ stylish }) => ({
  markdown: stylish.markdownInChat,
}));

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
    const { styles } = useStyles();
    const [role, setRole] = useState(value);
    const [isEdit, setTyping] = useControlledState(false, {
      onChange: onEditingChange,
      value: editing,
    });

    const [expand, setExpand] = useControlledState(false, {
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
        footer={
          isEdit ? (
            <MessageInputFooter
              onCancel={() => setTyping(false)}
              onConfirm={(text) => {
                setTyping(false);
                onChange?.(text);
              }}
              temporarySystemRole={role}
              text={{
                cancel: text?.cancel,
                confirm: text?.confirm,
              }}
            />
          ) : (
            footer
          )
        }
        okText={text?.edit || 'Edit'}
        onCancel={() => setExpand(false)}
        onOk={() => setTyping(true)}
        open={expand}
        title={text?.title}
      >
        {isEdit ? (
          <MessageInput
            defaultValue={role}
            height={height}
            placeholder={placeholder}
            setTemporarySystemRole={setRole}
            showFooter={false}
            style={mobile ? { height: '100%' } : {}}
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
