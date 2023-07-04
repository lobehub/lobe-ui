import { Button, ButtonProps } from 'antd';
import { type CSSProperties, memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import CodeEditor from '@/CodeEditor';
import { type TextAreaProps } from '@/Input';
import { DivProps } from '@/types';

export interface MessageInputProps extends DivProps {
  /**
   * @description Additional className to apply to the component.
   */
  className?: string;
  /**
   * @description The default value of the input box.
   */
  defaultValue?: string;
  height?: number | string;
  /**
   * @description Callback function triggered when user clicks on the cancel button.
   */
  onCancel?: () => void;
  /**
   * @description Callback function triggered when user clicks on the confirm button.
   * @param text - The text input by the user.
   */
  onConfirm?: (text: string) => void;
  /**
   * @description Custom rendering of the bottom buttons.
   * @param text - The text input by the user.
   */
  renderButtons?: (text: string) => ButtonProps[];
  textareaClassname?: string;
  textareaStyle?: CSSProperties;
  /**
   * @description The type of the input box.
   */
  type?: TextAreaProps['type'];
}

const MessageInput = memo<MessageInputProps>(
  ({
    type = 'pure',
    onCancel,
    defaultValue,
    onConfirm,
    renderButtons,
    textareaStyle,
    textareaClassname,
    placeholder = 'Type something...',
    height = 'fit-content',
    ...props
  }) => {
    const [temporarySystemRole, setRole] = useState<string>(defaultValue || '');

    return (
      <Flexbox gap={8} {...props}>
        <CodeEditor
          className={textareaClassname}
          language="md"
          onValueChange={(value: string) => {
            setRole(value);
          }}
          placeholder={placeholder}
          resize={false}
          style={{ height: height, ...textareaStyle }}
          type={type}
          value={temporarySystemRole}
        />
        <Flexbox direction={'horizontal-reverse'} gap={8}>
          {renderButtons ? (
            renderButtons(temporarySystemRole).map((buttonProps, index) => (
              <Button key={index} size="small" {...buttonProps} />
            ))
          ) : (
            <>
              <Button
                onClick={() => {
                  onConfirm?.(temporarySystemRole);
                }}
                size="small"
                type="primary"
              >
                Confirm
              </Button>
              <Button onClick={onCancel} size="small">
                Cancel
              </Button>
            </>
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default MessageInput;
