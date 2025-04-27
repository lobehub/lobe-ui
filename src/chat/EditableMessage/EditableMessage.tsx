'use client';

import { cx } from 'antd-style';
import { memo } from 'react';
import useControlledState from 'use-merge-value';

import Markdown from '@/Markdown';
import MessageInput from '@/chat/MessageInput';
import MessageModal from '@/chat/MessageModal';

import type { EditableMessageProps } from './type';

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
    styles: customStyles,
    className,
    style,
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
        className={cx(className, classNames?.input)}
        classNames={classNames}
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
        style={{
          ...style,
          ...customStyles?.input,
        }}
        styles={customStyles}
        text={text}
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
            className={cx(className, classNames?.markdown)}
            fontSize={fontSize}
            fullFeaturedCodeBlock={fullFeaturedCodeBlock}
            style={{
              height: isAutoSize ? 'unset' : height,
              ...style,
              ...customStyles?.markdown,
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
