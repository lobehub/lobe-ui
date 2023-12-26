import { Modal } from '@lobehub/ui';
import { Button } from 'antd';
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
        {Array.from({ length: 20 }).map((_, index) => (
          <p key={index}>Some contents...</p>
        ))}
      </Modal>
    </>
  );
};
