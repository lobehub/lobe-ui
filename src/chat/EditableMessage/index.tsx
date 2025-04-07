'use client';

import { CSSProperties, memo } from 'react';
import useControlledState from 'use-merge-value';

import Markdown, { type MarkdownProps } from '@/Markdown';
import MessageInput, { type MessageInputProps } from '@/chat/MessageInput';
import MessageModal, { type MessageModalProps } from '@/chat/MessageModal';

export interface EditableMessageProps {
  classNames?: {
    input?: string;
    markdown?: string;
    textarea?: string;
  };
  defaultValue?: string;
  editButtonSize?: MessageInputProps['editButtonSize'];
  editing?: boolean;
  fontSize?: number;
  fullFeaturedCodeBlock?: boolean;
  height?: MessageInputProps['height'];
  markdownProps?: Omit<MarkdownProps, 'className' | 'style' | 'children'>;
  model?: {
    extra?: MessageModalProps['extra'];
    footer?: MessageModalProps['footer'];
  };
  onChange?: (value: string) => void;
  onEditingChange?: (editing: boolean) => void;
  onOpenChange?: (open: boolean) => void;
  openModal?: boolean;
  placeholder?: string;
  showEditWhenEmpty?: boolean;
  styles?: {
    input?: CSSProperties;
    markdown?: CSSProperties;
  };
  text?: MessageModalProps['text'];
  value: string;
  variant?: MessageInputProps['variant'];
}

const EditableMessage = memo<EditableMessageProps>(
  ({
    value,
    onChange,
    classNames = {},
    onEditingChange,
    editing,
    openModal,
    onOpenChange,
    placeholder,
    showEditWhenEmpty = false,
    styles: stylesProps,
    height,
    variant,
    editButtonSize,
    text,
    fullFeaturedCodeBlock,
    model,
    fontSize,
    markdownProps,
  }) => {
    const [isEdit, setTyping] = useControlledState(false, {
      onChange: onEditingChange,
      value: editing,
    });

    const [expand, setExpand] = useControlledState<boolean>(false, {
      onChange: onOpenChange,
      value: openModal,
    });

    const isAutoSize = height === 'auto';

    const input = (
      <MessageInput
        className={classNames?.input}
        classNames={{ textarea: classNames?.textarea }}
        defaultValue={value}
        editButtonSize={editButtonSize}
        height={height}
        onCancel={() => setTyping(false)}
        onConfirm={(text) => {
          onChange?.(text);
          setTyping(false);
        }}
        placeholder={placeholder}
        shortcut
        style={stylesProps?.input}
        text={text}
        textareaClassname={classNames?.input}
        variant={variant}
      />
    );

    if (!value && showEditWhenEmpty) return input;

    return (
      <>
        {!expand && isEdit ? (
          input
        ) : (
          <Markdown
            className={classNames?.markdown}
            fontSize={fontSize}
            fullFeaturedCodeBlock={fullFeaturedCodeBlock}
            style={{
              height: isAutoSize ? 'unset' : height,
              ...stylesProps?.markdown,
            }}
            variant={'chat'}
            {...markdownProps}
          >
            {value || placeholder || ''}
          </Markdown>
        )}
        {expand && (
          <MessageModal
            editing={isEdit}
            extra={model?.extra}
            footer={model?.footer}
            height={height}
            onChange={onChange}
            onEditingChange={setTyping}
            onOpenChange={(e) => {
              setExpand(e);
              setTyping(false);
            }}
            open={expand}
            placeholder={placeholder}
            text={text}
            value={value}
          />
        )}
      </>
    );
  },
);

EditableMessage.displayName = 'EditableMessage';

export default EditableMessage;
