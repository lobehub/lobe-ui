import { Button } from '@lobehub/ui';
import { MessageModal } from '@lobehub/ui/chat';
import { Divider } from 'antd';
import { useState } from 'react';

export default () => {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState('');

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
          setEdit(true);
        }}
      >
        open to edit
      </Button>
      <MessageModal
        editing={edit}
        open={open}
        value={value || 'editable text'}
        onChange={setValue}
        onEditingChange={setEdit}
        onOpenChange={setOpen}
      />
      <Divider>Only change when click confirm</Divider>
      {value}
    </>
  );
};
