import { Button, Flexbox, Text } from '@lobehub/ui';
import { Modal } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [open, setOpen] = useState(false);
  const [customFooterOpen, setCustomFooterOpen] = useState(false);
  const [noFooterOpen, setNoFooterOpen] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [draggableOpen, setDraggableOpen] = useState(false);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      setLoadingOpen(false);
    }, 2000);
  };

  return (
    <>
      <Flexbox horizontal gap={12} wrap="wrap">
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          Basic Modal
        </Button>
        <Button
          onClick={() => {
            setCustomFooterOpen(true);
          }}
        >
          Custom Footer
        </Button>
        <Button
          onClick={() => {
            setNoFooterOpen(true);
          }}
        >
          No Footer
        </Button>
        <Button
          onClick={() => {
            setLoadingOpen(true);
          }}
        >
          Confirm Loading
        </Button>
        <Button
          onClick={() => {
            setDraggableOpen(true);
          }}
        >
          Draggable
        </Button>
      </Flexbox>

      <Modal
        open={open}
        title="Basic Modal"
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          setOpen(false);
        }}
      >
        <Text as="p">{Array.from({ length: 40 }).fill('Some contents').join(' ')}</Text>
      </Modal>

      <Modal
        open={customFooterOpen}
        title="Custom Footer"
        footer={(_, { OkBtn }) => (
          <>
            <Button
              onClick={() => {
                setCustomFooterOpen(false);
              }}
            >
              Custom Close
            </Button>
            <OkBtn />
          </>
        )}
        onCancel={() => {
          setCustomFooterOpen(false);
        }}
        onOk={() => {
          setCustomFooterOpen(false);
        }}
      >
        <Text as="p">Footer rendered via function with OkBtn / CancelBtn components.</Text>
      </Modal>

      <Modal
        footer={false}
        open={noFooterOpen}
        title="No Footer"
        onCancel={() => {
          setNoFooterOpen(false);
        }}
      >
        <Text as="p">This modal has no footer.</Text>
      </Modal>

      <Modal
        confirmLoading={confirmLoading}
        open={loadingOpen}
        title="Confirm Loading"
        onOk={handleOk}
        onCancel={() => {
          setLoadingOpen(false);
        }}
      >
        <Text as="p">Click OK to see loading state.</Text>
      </Modal>

      <Modal
        draggable
        open={draggableOpen}
        title="Draggable Modal"
        onCancel={() => {
          setDraggableOpen(false);
        }}
        onOk={() => {
          setDraggableOpen(false);
        }}
      >
        <Text as="p">Drag the title bar to move this modal around.</Text>
      </Modal>
    </>
  );
};
