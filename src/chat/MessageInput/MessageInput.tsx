'use client';

import { useResponsive } from 'antd-style';
import { memo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import Button from '@/base-ui/Button';
import { TextArea } from '@/base-ui/Input';
import CodeEditor from '@/CodeEditor';
import { Flexbox } from '@/Flex';
import { KeyMapEnum } from '@/Hotkey/const';
import { combineKeys } from '@/Hotkey/utils';
import { cx } from '@/styles';
import Tooltip from '@/Tooltip';

import { styles } from './style';
import type { MessageInputProps } from './type';

const MessageInput = memo<MessageInputProps>(
  ({
    text,
    variant = 'borderless',
    onCancel,
    defaultValue,
    onConfirm,
    renderButtons,
    placeholder,
    styles: customStyles,
    style,
    editButtonSize = 'middle',
    classNames,
    shortcut,
    language = 'markdown',
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const [temporaryValue, setValue] = useState<string>(defaultValue || '');
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

    const confirmButton = (
      <Button size={editButtonSize} type="primary" onClick={handleConfirm}>
        {confirmText}
      </Button>
    );

    const cancllButton = (
      <Button size={editButtonSize} type={'fill'} onClick={handleCancel}>
        {text?.cancel || 'Cancel'}
      </Button>
    );

    return (
      <Flexbox gap={16} style={{ flex: 1, width: '100%', ...style }} {...rest}>
        {mobile ? (
          <TextArea
            autoSize
            className={cx(styles, classNames?.editor)}
            placeholder={placeholder}
            style={customStyles?.editor}
            value={temporaryValue}
            variant={variant}
            onBlur={(e) => setValue(e.target.value)}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : (
          <CodeEditor
            className={cx(styles, classNames?.editor)}
            classNames={classNames}
            language={language}
            placeholder={placeholder}
            style={customStyles?.editor}
            styles={customStyles}
            value={temporaryValue}
            variant={variant}
            onBlur={(e) => setValue(e.target.value)}
            onValueChange={(e) => setValue(e)}
          />
        )}
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
