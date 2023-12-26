import { Button, ButtonProps } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

export interface MessageInputFooterProps {
  editButtonSize?: ButtonProps['size'];
  onCancel?: () => void;
  onConfirm?: (text: string) => void;
  renderButtons?: (text: string) => ButtonProps[];
  temporarySystemRole?: string;
  text?: {
    cancel?: string;
    confirm?: string;
  };
}

const MessageInputFooter = memo<MessageInputFooterProps>(
  ({ text, renderButtons, onConfirm, temporarySystemRole, editButtonSize, onCancel }) => {
    return (
      <Flexbox direction={'horizontal-reverse'} gap={8}>
        {renderButtons && temporarySystemRole ? (
          renderButtons(temporarySystemRole).map((buttonProps, index) => (
            <Button key={index} size="small" {...buttonProps} />
          ))
        ) : (
          <>
            <Button
              onClick={() => {
                onConfirm?.(temporarySystemRole || '');
              }}
              size={editButtonSize}
              type="primary"
            >
              {text?.confirm || 'Confirm'}
            </Button>
            <Button onClick={onCancel} size={editButtonSize}>
              {text?.cancel || 'Cancel'}
            </Button>
          </>
        )}
      </Flexbox>
    );
  },
);

export default MessageInputFooter;
