import { Button, ButtonProps } from 'antd';
import { cx } from 'antd-style';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { TextArea, type TextAreaProps } from '@/Input';

export interface MessageInputProps {
  /**
   * @description Additional className to apply to the component.
   */
  className?: string;
  /**
   * @description The default value of the input box.
   */
  defaultValue?: string;
  /**
   * @description The height of the input box.
   */
  height?: number;
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
  /**
   * @description The type of the input box.
   */
  type?: TextAreaProps['type'];
}

const MessageInput = memo<MessageInputProps>(
  ({ type, onCancel, defaultValue, onConfirm, renderButtons, height, className }) => {
    const [temporarySystemRole, setRole] = useState<string>(defaultValue || '');

    return (
      <Flexbox gap={8}>
        <TextArea
          className={cx('nowheel', className)}
          onChange={(e) => {
            setRole(e.target.value);
          }}
          placeholder={'例如：你是一名擅长翻译的翻译官，请将用户所输入的英文都翻译为中文。'}
          style={{ height: height ?? 200 }}
          type={type}
          value={temporarySystemRole}
        />
        <Flexbox direction={'horizontal-reverse'} gap={8}>
          {renderButtons ? (
            renderButtons(temporarySystemRole).map((buttonProps, index) => (
              <Button key={index} {...buttonProps} />
            ))
          ) : (
            <>
              <Button
                onClick={() => {
                  onConfirm?.(temporarySystemRole);
                }}
                type="primary"
              >
                Confirm
              </Button>

              <Button onClick={onCancel} type="text">
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
