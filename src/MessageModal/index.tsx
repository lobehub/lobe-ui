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
  /**
   * @description The value of the message content
   */
  value: string;
}

const MessageModal = memo<MessageModalProps>(
  ({ editing, open, onOpenChange, onEditingChange, value, onChange }) => {
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
        cancelText={'Cancel'}
        className={styles.modal}
        closeIcon={<Icon icon={X} />}
        footer={isEdit ? undefined : undefined}
        okText={'Edit'}
        onCancel={() => setExpand(false)}
        onOk={() => {
          setTyping(true);
        }}
        open={expand}
        title={
          <Flexbox align={'center'} gap={4} horizontal>
            Prompt
          </Flexbox>
        }
        width={800}
      >
        {isEdit ? (
          <MessageInput
            defaultValue={value}
            height={400}
            onCancel={() => setTyping(false)}
            onConfirm={(text) => {
              setTyping(false);
              onChange?.(text);
            }}
          />
        ) : (
          <Markdown className={styles.body}>{value}</Markdown>
        )}
      </Modal>
    );
  },
);

export default MessageModal;
