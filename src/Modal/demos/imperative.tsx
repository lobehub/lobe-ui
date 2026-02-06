import { Button, createModal, ModalHost, Text, useModalContext } from '@lobehub/ui';

const ModalContent = () => {
  const { close, setCanDismissByClickOutside } = useModalContext();

  return (
    <>
      <Text as={'p'}>{Array.from({ length: 120 }).fill('Some contents').join(' ')}</Text>
      <Button type="primary" onClick={close}>
        Close Modal
      </Button>
      <Button style={{ marginInlineStart: 8 }} onClick={() => setCanDismissByClickOutside(false)}>
        Disable Outside Click
      </Button>
      <Button style={{ marginInlineStart: 8 }} onClick={() => setCanDismissByClickOutside(true)}>
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
      <Button type="primary" onClick={openModal}>
        Open Imperative Modal
      </Button>
      <ModalHost />
    </>
  );
};
