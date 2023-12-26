import { ButtonProps } from 'antd';
import { type CSSProperties, memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import useMergeState from 'use-merge-value';

import { TextArea } from '@/Input';
import { type TextAreaProps } from '@/Input';
import { DivProps } from '@/types';

import MessageInputFooter, { type MessageInputFooterProps } from './MessageInputFooter';
import { useStyles } from './style';

export interface MessageInputProps extends MessageInputFooterProps, DivProps {
  className?: string;
  classNames?: TextAreaProps['classNames'];
  defaultValue?: string;
  editButtonSize?: ButtonProps['size'];
  height?: number | 'auto' | string;
  setTemporarySystemRole?: (value: string) => void;
  showFooter?: boolean;
  textareaClassname?: string;
  textareaStyle?: CSSProperties;
  type?: TextAreaProps['type'];
}

const MessageInput = memo<MessageInputProps>(
  ({
    text,
    type = 'pure',
    onCancel,
    defaultValue,
    onConfirm,
    renderButtons,
    textareaStyle,
    textareaClassname,
    placeholder,
    height = 'auto',
    style,
    editButtonSize = 'middle',
    showFooter = true,
    classNames,
    setTemporarySystemRole,
    ...rest
  }) => {
    const [role, setRole] = useMergeState(defaultValue || '', {
      defaultValue,
      onChange: setTemporarySystemRole,
    });
    const { cx, styles } = useStyles();

    const isAutoSize = height === 'auto';

    return (
      <Flexbox gap={16} style={{ flex: 1, width: '100%', ...style }} {...rest}>
        <TextArea
          autoSize={isAutoSize}
          className={cx(styles, textareaClassname)}
          classNames={classNames}
          onBlur={(e) => setRole(e.target.value)}
          onChange={(e) => setRole(e.target.value)}
          placeholder={placeholder}
          resize={false}
          style={{ height: isAutoSize ? 'unset' : height, minHeight: '100%', ...textareaStyle }}
          type={type}
          value={role}
        />
        {showFooter && (
          <MessageInputFooter
            editButtonSize={editButtonSize}
            onCancel={onCancel}
            onConfirm={onConfirm}
            renderButtons={renderButtons}
            temporarySystemRole={role}
            text={text}
          />
        )}
      </Flexbox>
    );
  },
);

export default MessageInput;
