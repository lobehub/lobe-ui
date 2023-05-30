import { Popconfirm } from 'antd';
import { createStyles } from 'antd-style';
import { EditIcon, RotateCwIcon, TrashIcon } from 'lucide-react';
import { rgba } from 'polished';
import { FC, memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import IconAction from '@/ActionIcon';
import { useStore } from '@/Chat/store';
import CopyButton from '@/CopyButton';

const useStyles = createStyles(({ css, token, stylish, cx }) => {
  return {
    container: cx(
      stylish.blur,
      css`
        background: ${rgba(token.colorBgElevated, 0.2)};
        border-radius: 4px;
      `,
    ),
  };
});

export interface ToolbarProps {
  className?: string;
  content: string;
  index: number;
  isUser?: boolean;
  readonly?: boolean;
}

const Toolbar: FC<ToolbarProps> = memo(({ content, isUser, index, readonly, className }) => {
  const { styles, cx } = useStyles();

  const [dispatchMessage, handleMessageEditing, resendMessage] = useStore(
    (s) => [s.dispatchMessage, s.handleMessageEditing, s.resendMessage],
    shallow,
  );

  return (
    <Flexbox className={cx(className, styles.container)} gap={4} horizontal>
      <CopyButton content={content} placement={'top'} size={'small'} title={'复制'} />
      {readonly ? null : (
        <>
          <IconAction
            icon={RotateCwIcon}
            onClick={() => {
              resendMessage(isUser ? index + 1 : index);
            }}
            placement={'top'}
            size={'small'}
            title={isUser ? '重新生成回答' : '重新生成'}
          />

          <IconAction
            icon={EditIcon}
            onClick={() => handleMessageEditing(index)}
            placement={'top'}
            size={'small'}
            title={'编辑'}
          />
          <Popconfirm
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              dispatchMessage({ type: 'deleteMessage', index });
            }}
            title={'确定要删除这条消息吗？'}
          >
            <IconAction
              // type={'danger'}
              icon={TrashIcon}
              placement={'top'}
              size={'small'}
              title={'删除'}
            />
          </Popconfirm>
        </>
      )}
    </Flexbox>
  );
});

export default Toolbar;
