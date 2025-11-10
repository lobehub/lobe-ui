import { Button, EmojiPicker } from '@lobehub/ui';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const [open, setOpen] = useState(false);
  return (
    <Flexbox gap={16}>
      <EmojiPicker onOpenChange={setOpen} open={open} />
      <Button onClick={() => setOpen(true)}>Open Emoji Picker</Button>
    </Flexbox>
  );
};
