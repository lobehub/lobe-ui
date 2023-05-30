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
  index: number;
  content: string;
  readonly?: boolean;
  className?: string;
  isUser?: boolean;
}

const Toolbar: FC<ToolbarProps> = memo(({ content, isUser, index, readonly, className }) => {
  const { styles, cx } = useStyles();

  const [dispatchMessage, handleMessageEditing, resendMessage] = useStore(
    (s) => [s.dispatchMessage, s.handleMessageEditing, s.resendMessage],
    shallow,
  );

  return (
    <Flexbox gap={4} horizontal className={cx(className, styles.container)}>
      <CopyButton
        placement={'top'}
        title={'复制'}
        content={content}
        // icon={CopyIcon}
        size={'small'}
        // onClick={() => {
        //   copy(content);
        // }}
      />
      {readonly ? null : (
        <>
          <IconAction
            placement={'top'}
            title={isUser ? '重新生成回答' : '重新生成'}
            icon={RotateCwIcon}
            size={'small'}
            onClick={() => {
              resendMessage(isUser ? index + 1 : index);
            }}
          />

          <IconAction
            placement={'top'}
            title={'编辑'}
            icon={EditIcon}
            size={'small'}
            onClick={() => handleMessageEditing(index)}
          />
          <Popconfirm
            title={'确定要删除这条消息吗？'}
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              dispatchMessage({ type: 'deleteMessage', index });
            }}
          >
            <IconAction
              // type={'danger'}
              placement={'top'}
              title={'删除'}
              icon={TrashIcon}
              size={'small'}
            />
          </Popconfirm>
        </>
      )}
    </Flexbox>
  );
});

export default Toolbar;
