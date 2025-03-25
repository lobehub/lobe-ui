'use client';

import { Button, ButtonProps } from 'antd';
import { type CSSProperties, memo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Flexbox } from 'react-layout-kit';

import Hotkey from '@/Hotkey';
import { KeyMapEnum } from '@/Hotkey/type';
import { combineKeys } from '@/Hotkey/utils';
import { TextArea } from '@/Input';
import { type TextAreaProps } from '@/Input';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface MessageInputProps extends DivProps {
  /**
   * @description Additional className to apply to the component.
   */
  className?: string;
  classNames?: TextAreaProps['classNames'];
  /**
   * @description The default value of the input box.
   */
  defaultValue?: string;
  editButtonSize?: ButtonProps['size'];
  height?: number | 'auto' | string;
  /**
   * @description Callback function triggered when user clicks on the cancel button.
   */
  onCancel?: () => void;

  /**
   * @description Callback function triggered when user clicks on the confirm button.
   * @param text - The text input by the user.
   */
  onConfirm?: (text: string) => void;
  placeholder?: string;
  /**
   * @description Custom rendering of the bottom buttons.
   * @param text - The text input by the user.
   */
  renderButtons?: (text: string) => ButtonProps[];
  shortcut?: boolean;
  text?: {
    cancel?: string;
    confirm?: string;
  };
  textareaClassname?: string;
  textareaStyle?: CSSProperties;
  /**
   * @description The type of the input box.
   */
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
    classNames,
    shortcut,
    ...rest
  }) => {
    const [temporaryValue, setValue] = useState<string>(defaultValue || '');
    const { cx, styles } = useStyles();
    const hotkey = combineKeys([KeyMapEnum.Mod, KeyMapEnum.Enter]);
    const isAutoSize = height === 'auto';

    useHotkeys(hotkey, () => onConfirm?.(temporaryValue), {
      enableOnFormTags: true,
      enabled: shortcut,
      preventDefault: true,
    });

    return (
      <Flexbox gap={16} style={{ flex: 1, width: '100%', ...style }} {...rest}>
        <TextArea
          autoSize={isAutoSize}
          className={cx(styles, textareaClassname)}
          classNames={classNames}
          onBlur={(e) => setValue(e.target.value)}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          resize={false}
          style={textareaStyle}
          type={type}
          value={temporaryValue}
        />
        <Flexbox direction={'horizontal-reverse'} gap={8}>
          {renderButtons ? (
            renderButtons(temporaryValue).map((buttonProps, index) => (
              <Button key={index} size="small" {...buttonProps} />
            ))
          ) : (
            <>
              <Button
                onClick={() => onConfirm?.(temporaryValue)}
                size={editButtonSize}
                type="primary"
              >
                {text?.confirm || 'Confirm'}
                {shortcut && (
                  <Hotkey inverseTheme keys={combineKeys([KeyMapEnum.Mod, KeyMapEnum.Enter])} />
                )}
              </Button>
              <Button onClick={onCancel} size={editButtonSize}>
                {text?.cancel || 'Cancel'}
              </Button>
            </>
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default MessageInput;
