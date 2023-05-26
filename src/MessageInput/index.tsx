import { TextArea, type TextAreaProps } from '@/index';
import { Button, ButtonProps } from 'antd';
import { cx } from 'antd-style';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

/**
 * @title MessageInputProps
 * @category Props
 * @description MessageInput 组件的 Props
 */
export interface MessageInputProps {
  /**
   * @title 确认回调函数
   * @description 用户点击确认按钮后的回调函数
   * @param text - 用户输入的文本
   */
  onConfirm?: (text: string) => void;
  /**
   * @title 取消回调函数
   * @description 用户点击取消按钮后的回调函数
   */
  onCancel?: () => void;
  /**
   * @title 默认值
   * @description 输入框的默认值
   */
  defaultValue?: string;
  /**
   * @title 渲染按钮
   * @description 自定义渲染底部按钮
   * @param text - 用户输入的文本
   */
  renderButtons?: (text: string) => ButtonProps[];
  height?: number;
  className?: string;
  type?: TextAreaProps['type'];
}

const MessageInput = memo<MessageInputProps>(
  ({ type, onCancel, defaultValue, onConfirm, renderButtons, height, className }) => {
    const [tempSystemRole, setRole] = useState<string>(defaultValue || '');

    return (
      <Flexbox gap={8}>
        <TextArea
          type={type}
          value={tempSystemRole}
          placeholder={'例如：你是一名擅长翻译的翻译官，请将用户所输入的英文都翻译为中文。'}
          style={{ height: height ?? 200 }}
          onChange={(e) => {
            setRole(e.target.value);
          }}
          className={cx('nowheel', className)}
        />
        <Flexbox direction={'horizontal-reverse'} gap={8}>
          {renderButtons ? (
            renderButtons(tempSystemRole).map((buttonProps, index) => (
              <Button key={index} {...buttonProps} />
            ))
          ) : (
            <>
              <Button
                type="primary"
                onClick={() => {
                  onConfirm?.(tempSystemRole);
                }}
              >
                Confirm
              </Button>

              <Button type="text" onClick={onCancel}>
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
