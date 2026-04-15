import { Button, Flexbox, Text } from '@lobehub/ui';
import { confirmModal, createModal, ModalHost, useModalContext } from '@lobehub/ui/base-ui';

const NestedBody = () => {
  const { close } = useModalContext();

  const openConfirm = () => {
    confirmModal({
      cancelText: 'Keep editing',
      content:
        'Discarding will lose unsaved changes. The confirm overlay should sit above this modal.',
      okButtonProps: { danger: true },
      okText: 'Discard',
      onOk: () => {
        close();
      },
      title: 'Discard changes?',
    });
  };

  return (
    <Flexbox gap={16}>
      <Text style={{ fontSize: 13, lineHeight: 1.7 }}>
        Trigger a nested <Text code>confirmModal</Text> from within this modal. The nested overlay
        must stack above the parent, not beneath it.
      </Text>
      <Flexbox horizontal gap={8} justify="flex-end">
        <Button onClick={close}>Cancel</Button>
        <Button danger type="primary" onClick={openConfirm}>
          Discard…
        </Button>
      </Flexbox>
    </Flexbox>
  );
};

const openParent = () => {
  createModal({
    content: <NestedBody />,
    title: 'Edit document',
    width: 480,
  });
};

export default () => (
  <Flexbox gap={16} padding={16} style={{ margin: '0 auto', maxWidth: 560 }}>
    <Flexbox horizontal align="center" gap={10}>
      <Flexbox flex={1} gap={2}>
        <Text style={{ fontSize: 14, fontWeight: 500 }}>Nested Modal Stacking</Text>
        <Text style={{ fontSize: 12, opacity: 0.5 }}>
          createModal → confirmModal — verify overlay order
        </Text>
      </Flexbox>
      <Button type="primary" onClick={openParent}>
        Open
      </Button>
    </Flexbox>
    <ModalHost />
  </Flexbox>
);
