import { Button, Flexbox, Text } from '@lobehub/ui';
import {
  DropdownMenuItem,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  ModalBackdrop,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  ModalTitle,
} from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Flexbox gap={16} padding={16} style={{ margin: '0 auto', maxWidth: 560 }}>
      <Flexbox gap={4}>
        <Text style={{ fontSize: 14, fontWeight: 500 }}>
          z-index regression: DropdownMenu inside Modal
        </Text>
        <Text style={{ fontSize: 12, opacity: 0.6 }}>
          Open the modal, then click the in-modal "Open Dropdown" button. Expected: dropdown popup
          renders above the modal popup. Bug: dropdown sits below the modal panel.
        </Text>
      </Flexbox>

      <Button onClick={() => setModalOpen(true)}>Open Modal</Button>

      <ModalRoot
        open={modalOpen}
        onOpenChange={(next) => {
          if (!next) setModalOpen(false);
        }}
      >
        <ModalPortal>
          <ModalBackdrop />
          <ModalPopup width={420}>
            <ModalHeader>
              <ModalTitle>Modal with inner Dropdown</ModalTitle>
              <ModalClose />
            </ModalHeader>
            <ModalContent>
              <Flexbox gap={12}>
                <Text>Click the button below to open a dropdown inside this modal.</Text>
                <DropdownMenuRoot>
                  <DropdownMenuTrigger nativeButton>
                    <Button>Open Dropdown</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuPositioner placement="bottomLeft">
                      <DropdownMenuPopup>
                        <DropdownMenuItem>Item A</DropdownMenuItem>
                        <DropdownMenuItem>Item B</DropdownMenuItem>
                        <DropdownMenuItem>Item C</DropdownMenuItem>
                      </DropdownMenuPopup>
                    </DropdownMenuPositioner>
                  </DropdownMenuPortal>
                </DropdownMenuRoot>
              </Flexbox>
            </ModalContent>
          </ModalPopup>
        </ModalPortal>
      </ModalRoot>
    </Flexbox>
  );
};
