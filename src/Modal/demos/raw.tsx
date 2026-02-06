import { Button, createRawModal, Modal, Text } from '@lobehub/ui';
import { memo, useCallback } from 'react';

type RawDemoModalProps = {
  fileId: string;
  onClose: () => void;
  open: boolean;
};

const RawDemoModal = memo<RawDemoModalProps>(({ fileId, onClose, open }) => {
  return (
    <Modal
      open={open}
      title="Move To Folder"
      footer={
        <Button type="primary" onClick={onClose}>
          Close
        </Button>
      }
      onCancel={onClose}
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
    <Button type="primary" onClick={openModal}>
      Open Raw Modal
    </Button>
  );
};
