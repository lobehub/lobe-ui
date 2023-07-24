import { Modal } from 'antd';
import { X } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import Icon from '@/Icon';
import Markdown from '@/Markdown';
import MessageInput from '@/MessageInput';

import { useStyles } from './style';

export interface MessageModalProps {
  /**
   * @description Whether the message is being edited or not
   * @default false
   */
  editing?: boolean;
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
  open?: boolean;
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
  ({ editing, open, onOpenChange, onEditingChange, placeholder, value, onChange, text }) => {
    const { styles } = useStyles();

    const [isEdit, setTyping] = useControlledState(false, {
      onChange: onEditingChange,
      value: editing,
    });

    const [expand, setExpand] = useControlledState(false, {
      onChange: onOpenChange,
      value: open,
    });

    return (
      <Modal
        cancelText={text?.cancel || 'Cancel'}
        className={styles.modal}
        closeIcon={<Icon icon={X} />}
        footer={isEdit ? null : undefined}
        okText={text?.edit || 'Edit'}
        onCancel={() => setExpand(false)}
        onOk={() => {
          setTyping(true);
        }}
        open={expand}
        title={
          <Flexbox align={'center'} gap={4} horizontal>
            {text?.title || 'Prompt'}
          </Flexbox>
        }
        width={800}
      >
        {isEdit ? (
          <MessageInput
            defaultValue={value}
            height="70vh"
            onCancel={() => setTyping(false)}
            onConfirm={(text) => {
              setTyping(false);
              onChange?.(text);
            }}
            placeholder={placeholder}
            text={{
              cancel: text?.cancel,
              confirm: text?.confirm,
            }}
          />
        ) : (
          <Markdown className={styles.body} style={value ? {} : { opacity: 0.5 }}>
            {String(value || placeholder)}
          </Markdown>
        )}
      </Modal>
    );
  },
);

export default MessageModal;
