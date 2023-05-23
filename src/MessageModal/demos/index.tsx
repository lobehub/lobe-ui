import { MessageModal } from '@lobehub/ui';
import { Button } from 'antd';
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
      <MessageModal open={open} onOpenChange={setOpen} value={'editable text'} />
    </>
  );
};
