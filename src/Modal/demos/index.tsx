import { Button, Modal, Text } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} type="primary">
        Open Modal
      </Button>
      <Modal onCancel={handleCancel} onOk={handleOk} open={isModalOpen} title="Basic Modal">
        <Text as={'p'}>{Array.from({ length: 200 }).fill('Some contents').join(' ')}</Text>
      </Modal>
    </>
  );
};
