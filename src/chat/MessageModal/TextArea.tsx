import { memo, useState } from 'react';

import TextArea, { type TextAreaProps } from '@/Input/TextArea';

interface MessageTextAreaProps extends Omit<TextAreaProps, 'onChange' | 'onBlur' | 'value'> {
  defaultValue: string;
  onChange?: (value: string) => void;
}
const MessageTextArea = memo<MessageTextAreaProps>(({ defaultValue, onChange, ...rest }) => {
  const [text, setText] = useState<string>(defaultValue || '');

  return (
    <TextArea
      onBlur={() => onChange?.(text)}
      onChange={(e) => {
        setText(e.target.value);
      }}
      onPressEnter={() => {
        onChange?.(text);
      }}
      {...rest}
      value={text}
    />
  );
});

export default MessageTextArea;
