import { Button, Text } from '@lobehub/ui';
import {
  ModalBackdrop,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  ModalTitle,
} from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Atom Modal
      </Button>
      <ModalRoot
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setOpen(false);
        }}
      >
        <ModalPortal>
          <ModalBackdrop />
          <ModalPopup width={480}>
            <ModalHeader>
              <ModalTitle>Atom Composition</ModalTitle>
              <ModalClose />
            </ModalHeader>
            <ModalContent>
              <Text as="p">Built with atomic primitives — animation is built into the atoms.</Text>
            </ModalContent>
            <ModalFooter>
              <ModalClose />
            </ModalFooter>
          </ModalPopup>
        </ModalPortal>
      </ModalRoot>
    </>
  );
};
