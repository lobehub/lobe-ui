import Markdown from '@/Markdown';
import MessageInput from '@/MessageInput';
import { AimOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';
import { useStyles } from './style';

export interface MessageModalProps {
  /**
   * @description Whether the modal is open or not
   * @default false
   */
  open?: boolean;
  /**
   * @description Callback fired when open state is changed
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * @description Whether the message is being edited or not
   * @default false
   */
  editing?: boolean;
  /**
   * @description Callback fired when editing state is changed
   */
  onEditingChange?: (editing: boolean) => void;
  /**
   * @description Callback fired when message content is changed
   */
  onChange?: (text: string) => void;
  /**
   * @description The value of the message content
   */
  value: string;
}

const MessageModal = memo<MessageModalProps>(
  ({ editing, open, onOpenChange, onEditingChange, value, onChange }) => {
    const { styles } = useStyles();

    const [isEdit, setTyping] = useControlledState(false, {
      value: editing,
      onChange: onEditingChange,
    });

    const [expand, setExpand] = useControlledState(false, {
      value: open,
      onChange: onOpenChange,
    });

    return (
      <Modal
        open={expand}
        width={800}
        onCancel={() => setExpand(false)}
        okText={'编辑'}
        onOk={() => {
          setTyping(true);
        }}
        footer={isEdit ? null : undefined}
        cancelText={'关闭'}
        title={
          <Flexbox horizontal align={'center'} gap={4}>
            <AimOutlined />
            提示词
          </Flexbox>
        }
        className={styles.modal}
      >
        {isEdit ? (
          <MessageInput
            onConfirm={(text) => {
              setTyping(false);
              onChange?.(text);
            }}
            onCancel={() => setTyping(false)}
            defaultValue={value}
            height={400}
          />
        ) : (
          <Markdown className={styles.body}>{value}</Markdown>
        )}
      </Modal>
    );
  },
);

export default MessageModal;
