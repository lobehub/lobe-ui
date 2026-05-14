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
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Flexbox gap={16} padding={16} style={{ margin: '0 auto', maxWidth: 560 }}>
      <Flexbox gap={4}>
        <Text style={{ fontSize: 14, fontWeight: 500 }}>
          z-index regression: Modal vs DropdownMenu
        </Text>
        <Text style={{ fontSize: 12, opacity: 0.6 }}>
          Open the dropdown, then click "Open Modal". Both should remain mounted. Expected: modal
          renders above the dropdown. Bug: modal sits below the dropdown popup.
        </Text>
      </Flexbox>

      <Flexbox horizontal gap={8}>
        <DropdownMenuRoot open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger nativeButton>
            <Button>Open Dropdown</Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuPositioner placement="bottomLeft">
              <DropdownMenuPopup>
                <DropdownMenuItem
                  closeOnClick={false}
                  onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(true);
                  }}
                >
                  Open Modal (keep menu open)
                </DropdownMenuItem>
                <DropdownMenuItem closeOnClick={false}>Stay here</DropdownMenuItem>
              </DropdownMenuPopup>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </Flexbox>

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
              <ModalTitle>Modal from Dropdown</ModalTitle>
              <ModalClose />
            </ModalHeader>
            <ModalContent>
              <Text>
                If you can read this, the modal is on top. If the dropdown menu covers this content,
                the z-index hierarchy is broken.
              </Text>
            </ModalContent>
          </ModalPopup>
        </ModalPortal>
      </ModalRoot>
    </Flexbox>
  );
};
