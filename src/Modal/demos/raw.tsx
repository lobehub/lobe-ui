import { Button, Modal, Text, createRawModal } from '@lobehub/ui';
import { memo, useCallback } from 'react';

type RawDemoModalProps = {
  fileId: string;
  onClose: () => void;
  open: boolean;
};

const RawDemoModal = memo<RawDemoModalProps>(({ fileId, onClose, open }) => {
  return (
    <Modal
      footer={
        <Button onClick={onClose} type="primary">
          Close
        </Button>
      }
      onCancel={onClose}
      open={open}
      title="Move To Folder"
    >
      <Text as={'p'}>File ID: {fileId}</Text>
    </Modal>
  );
});

RawDemoModal.displayName = 'RawDemoModal';

export default () => {
  const openModal = useCallback(() => {
    createRawModal(RawDemoModal, { fileId: 'file-123' });
  }, []);

  return (
    <Button onClick={openModal} type="primary">
      Open Raw Modal
    </Button>
  );
};
