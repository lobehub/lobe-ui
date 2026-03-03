import { Button, Text } from '@lobehub/ui';
import { createModalSystem, useModalContext } from '@lobehub/ui/base-ui';

const { ModalHost, createModal } = createModalSystem();

const ModalContent = () => {
  const { close } = useModalContext();
  return (
    <>
      <Text as="p">This modal was created imperatively.</Text>
      <Text as="p">
        You can close it via <code>instance.close()</code> or the context:
      </Text>
      <Button style={{ marginBlockStart: 16 }} type="primary" onClick={close}>
        Close via Context
      </Button>
    </>
  );
};

const openModal = () => {
  const instance = createModal({
    content: <ModalContent />,
    title: 'Imperative Modal',
  });

  setTimeout(() => {
    instance.update({ title: 'Updated Title (after 1s)' });
  }, 1000);
};

export default () => (
  <>
    <Button type="primary" onClick={openModal}>
      Open Imperative Modal
    </Button>
    <ModalHost />
  </>
);
