import { Button, ModalHost, Text, createModal, useModalContext } from '@lobehub/ui';

const ModalContent = () => {
  const { close, setCanDismissByClickOutside } = useModalContext();

  return (
    <>
      <Text as={'p'}>{Array.from({ length: 120 }).fill('Some contents').join(' ')}</Text>
      <Button onClick={close} type="primary">
        Close Modal
      </Button>
      <Button onClick={() => setCanDismissByClickOutside(false)} style={{ marginInlineStart: 8 }}>
        Disable Outside Click
      </Button>
      <Button onClick={() => setCanDismissByClickOutside(true)} style={{ marginInlineStart: 8 }}>
        Enable Outside Click
      </Button>
    </>
  );
};

export default () => {
  const openModal = () => {
    createModal({
      children: <ModalContent />,
      footer: null,
      title: 'Imperative Modal',
    });
  };

  return (
    <>
      <Button onClick={openModal} type="primary">
        Open Imperative Modal
      </Button>
      <ModalHost />
    </>
  );
};
