'use client';

import clsx from 'clsx';
import { memo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import Button from '@/Button';
import CodeEditor from '@/CodeEditor';
import { Flexbox } from '@/Flex';
import { KeyMapEnum } from '@/Hotkey/const';
import { combineKeys } from '@/Hotkey/utils';
import { TextArea } from '@/Input';
import { styleProps } from '@/styles/stylex/props';
import { useResponsive } from '@/styles/theme/scope';
import Tooltip from '@/Tooltip';

import { chatMessageInputClasses } from './stable';
import { rootStyles, styles } from './style';
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
    className,
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
      <Button
        className={chatMessageInputClasses('confirm')}
        size={editButtonSize}
        type="primary"
        onClick={handleConfirm}
      >
        {confirmText}
      </Button>
    );

    const cancllButton = (
      <Button
        className={chatMessageInputClasses('cancel')}
        size={editButtonSize}
        type={'fill'}
        onClick={handleCancel}
      >
        {text?.cancel || 'Cancel'}
      </Button>
    );

    return (
      <Flexbox
        gap={16}
        {...styleProps(rootStyles.root, clsx(chatMessageInputClasses(), className), style)}
        {...rest}
      >
        {mobile ? (
          <TextArea
            autoSize
            className={clsx(chatMessageInputClasses('editor'), styles, classNames?.editor)}
            placeholder={placeholder}
            style={customStyles?.editor}
            value={temporaryValue}
            variant={variant}
            onBlur={(e) => setValue(e.target.value)}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : (
          <CodeEditor
            className={clsx(chatMessageInputClasses('editor'), styles, classNames?.editor)}
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
        <Flexbox
          className={chatMessageInputClasses('actions')}
          direction={'horizontal-reverse'}
          gap={8}
        >
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
