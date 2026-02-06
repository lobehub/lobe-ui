import { Button } from '@lobehub/ui';
import { MessageModal } from '@lobehub/ui/chat';
import { useState } from 'react';

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        open
      </Button>
      <MessageModal open={open} value={'editable text'} onOpenChange={setOpen} />
    </>
  );
};
