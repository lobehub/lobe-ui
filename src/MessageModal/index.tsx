import { AimOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import Markdown from '@/Markdown';
import MessageInput from '@/MessageInput';

const useStyles = createStyles(({ css, prefixCls }) => ({
  modal: css`
    height: 70%;
    .${prefixCls}-modal-header {
      margin-bottom: 24px;
    }
  `,
  body: css`
    overflow-y: scroll;
    max-height: 70vh;
  `,
}));

export interface MessageModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  editing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  onChange?: (text: string) => void;
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
