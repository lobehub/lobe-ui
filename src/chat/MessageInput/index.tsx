'use client';

import { type CSSProperties, memo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Flexbox } from 'react-layout-kit';

import Button, { type ButtonProps } from '@/Button';
import CodeEditor, { type CodeEditorProps } from '@/CodeEditor';
import { KeyMapEnum } from '@/Hotkey/type';
import { combineKeys } from '@/Hotkey/utils';
import Tooltip from '@/Tooltip';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface MessageInputProps extends DivProps {
  className?: string;
  classNames?: CodeEditorProps['classNames'];
  defaultValue?: string;
  editButtonSize?: ButtonProps['size'];
  height?: number | 'auto' | string;
  onCancel?: () => void;
  onConfirm?: (text: string) => void;
  placeholder?: string;
  renderButtons?: (text: string) => ButtonProps[];
  shortcut?: boolean;
  text?: {
    cancel?: string;
    confirm?: string;
  };
  textareaClassname?: string;
  textareaStyle?: CSSProperties;
  variant?: CodeEditorProps['variant'];
}

const MessageInput = memo<MessageInputProps>(
  ({
    text,
    variant = 'borderless',
    onCancel,
    defaultValue,
    onConfirm,
    renderButtons,
    textareaStyle,
    textareaClassname,
    placeholder,
    style,
    editButtonSize = 'middle',
    classNames,
    shortcut,
    ...rest
  }) => {
    const [temporaryValue, setValue] = useState<string>(defaultValue || '');
    const { cx, styles } = useStyles();
    const confirmHotkey = combineKeys([KeyMapEnum.Mod, KeyMapEnum.Enter]);
    const confirmText = text?.confirm || 'Confirm';
    const cancelHotkey = combineKeys([KeyMapEnum.Esc]);
    const cancelText = text?.cancel || 'Cancel';

    const handleConfirm = () => onConfirm?.(temporaryValue);
    const handleCancel = () => onCancel?.();

    useHotkeys(confirmHotkey, handleConfirm, {
      enableOnFormTags: true,
      enabled: shortcut,
      preventDefault: true,
    });

    useHotkeys(cancelHotkey, handleCancel, {
      enableOnFormTags: true,
      enabled: shortcut,
      preventDefault: true,
    });

    const confirmButton = (
      <Button onClick={handleConfirm} size={editButtonSize} type="primary">
        {confirmText}
      </Button>
    );

    const cancllButton = (
      <Button onClick={handleCancel} size={editButtonSize} variant={'filled'}>
        {text?.cancel || 'Cancel'}
      </Button>
    );

    return (
      <Flexbox gap={16} style={{ flex: 1, width: '100%', ...style }} {...rest}>
        <CodeEditor
          className={cx(styles, textareaClassname)}
          classNames={classNames}
          language={'markdown'}
          onBlur={(e) => setValue(e.target.value)}
          onValueChange={(e) => setValue(e)}
          placeholder={placeholder}
          style={textareaStyle}
          value={temporaryValue}
          variant={variant}
        />
        <Flexbox direction={'horizontal-reverse'} gap={8}>
          {renderButtons ? (
            renderButtons(temporaryValue).map((buttonProps, index) => (
              <Button key={index} size={editButtonSize} {...buttonProps} />
            ))
          ) : (
            <>
              {shortcut ? (
                <Tooltip hotkey={confirmHotkey} title={confirmText}>
                  {confirmButton}
                </Tooltip>
              ) : (
                confirmButton
              )}
              {shortcut ? (
                <Tooltip hotkey={cancelHotkey} title={cancelText}>
                  {cancllButton}
                </Tooltip>
              ) : (
                cancllButton
              )}
            </>
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default MessageInput;
