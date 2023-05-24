import { EditableMessage } from '@lobehub/ui';
import { Button, Divider } from 'antd';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const [editing, setEdit] = useState(false);
  return (
    <Flexbox width={400}>
      <Button
        onClick={() => {
          setEdit(true);
        }}
      >
        编辑
      </Button>
      <Divider />
      <EditableMessage value={'editable text'} editing={editing} onEditingChange={setEdit} />
    </Flexbox>
  );
};
