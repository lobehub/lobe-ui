import { Button, EmojiPicker } from '@lobehub/ui';
import { useState } from 'react';

import { Flexbox } from '@/Flex';

export default () => {
  const [open, setOpen] = useState(false);
  return (
    <Flexbox gap={16}>
      <EmojiPicker open={open} onOpenChange={setOpen} />
      <Button onClick={() => setOpen(true)}>Open Emoji Picker</Button>
    </Flexbox>
  );
};
