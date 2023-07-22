import { CSSProperties, memo } from 'react';
import useControlledState from 'use-merge-value';

import Markdown from '@/Markdown';
import MessageInput from '@/MessageInput';
import MessageModal from '@/MessageModal';

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
  };
  editButtonSize?: 'small' | 'middle';
  /**
   * @title Whether the component is in edit mode or not
   * @default false
   */
  editing?: boolean;
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
    placeholder = 'Type something...',
    showEditWhenEmpty = false,
    styles,
    editButtonSize,
  }) => {
    const [isEdit, setTyping] = useControlledState(false, {
      onChange: onEditingChange,
      value: editing,
    });

    const [expand, setExpand] = useControlledState<boolean>(false, {
      onChange: onOpenChange,
      value: openModal,
    });

    return !value && showEditWhenEmpty ? (
      <MessageInput
        className={classNames?.input}
        defaultValue={value}
        editButtonSize={editButtonSize}
        onCancel={() => setTyping(false)}
        onConfirm={(text) => {
          onChange?.(text);
          setTyping(false);
        }}
        placeholder={placeholder}
        style={styles?.input}
      />
    ) : (
      <>
        <MessageModal
          editing={isEdit}
          onChange={(text) => {
            onChange?.(text);
          }}
          onEditingChange={setTyping}
          onOpenChange={setExpand}
          open={expand}
          value={value}
        />
        {!expand && isEdit ? (
          <MessageInput
            className={classNames?.input}
            defaultValue={value}
            editButtonSize={editButtonSize}
            onCancel={() => setTyping(false)}
            onConfirm={(text) => {
              onChange?.(text);
              setTyping(false);
            }}
            placeholder={placeholder}
            style={styles?.input}
          />
        ) : (
          <Markdown className={classNames?.markdown} style={styles?.markdown}>
            {value}
          </Markdown>
        )}
      </>
    );
  },
);

export default EditableMessage;
