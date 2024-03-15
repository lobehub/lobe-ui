import { CSSProperties, memo } from 'react';
import useControlledState from 'use-merge-value';

import Markdown from '@/Markdown';
import MessageInput, { type MessageInputProps } from '@/MessageInput';
import MessageModal, { type MessageModalProps } from '@/MessageModal';

export interface EditableMessageProps {
  /**
   * @title The class name for the Markdown and MessageInput component
   */
  classNames?: {
    /**
     * @title The class name for the MessageInput component
     */
    input?: string;
    /**
     * @title The class name for the Markdown component
     */
    markdown?: string;
    textarea?: string;
  };
  editButtonSize?: MessageInputProps['editButtonSize'];
  /**
   * @title Whether the component is in edit mode or not
   * @default false
   */
  editing?: boolean;
  fullFeaturedCodeBlock?: boolean;
  height?: MessageInputProps['height'];
  inputType?: MessageInputProps['type'];
  model?: {
    extra?: MessageModalProps['extra'];
    footer?: MessageModalProps['footer'];
  };
  /**
   * @title Callback function when the value changes
   * @param value - The new value
   */
  onChange?: (value: string) => void;
  /**
   * @title Callback function when the editing state changes
   * @param editing - Whether the component is in edit mode or not
   */
  onEditingChange?: (editing: boolean) => void;
  /**
   * @title Callback function when the modal open state changes
   * @param open - Whether the modal is open or not
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * @title Whether the modal is open or not
   * @default false
   */
  openModal?: boolean;
  placeholder?: string;
  /**
   * @title Whether to show the edit button when the text value is empty
   * @default false
   */
  showEditWhenEmpty?: boolean;
  styles?: {
    /**
     * @title The style for the MessageInput component
     */
    input?: CSSProperties;
    /**
     * @title The style for the Markdown component
     */
    markdown?: CSSProperties;
  };
  text?: MessageModalProps['text'];
  /**
   * @title The current text value
   */
  value: string;
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
    inputType,
    editButtonSize,
    text,
    fullFeaturedCodeBlock,
    model,
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
        style={stylesProps?.input}
        text={text}
        textareaClassname={classNames?.input}
        type={inputType}
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
            fullFeaturedCodeBlock={fullFeaturedCodeBlock}
            style={{
              height: isAutoSize ? 'unset' : height,
              overflowX: 'hidden',
              overflowY: 'auto',
              ...stylesProps?.markdown,
            }}
            variant={'chat'}
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

export default EditableMessage;
