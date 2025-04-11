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
        onChange={setValue}
        onEditingChange={setEdit}
        onOpenChange={setOpen}
        open={open}
        value={value || 'editable text'}
      />
      <Divider>Only change when click confirm</Divider>
      {value}
    </>
  );
};
