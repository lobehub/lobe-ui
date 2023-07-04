import { EditableMessage, StroyBook, useControls, useCreateStore } from '@lobehub/ui';
import { content } from '@lobehub/ui/Markdown/demos/data';
import { button } from 'leva';
import { useState } from 'react';

export default () => {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEdit] = useState(false);
  const store = useCreateStore();

  useControls(
    {
      editing: button(() => {
        setEdit(true);
      }),
      openModal: button(() => {
        setOpenModal(true);
      }),
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <EditableMessage
        editing={editing}
        onEditingChange={setEdit}
        onOpenChange={setOpenModal}
        openModal={openModal}
        value={content}
      />
    </StroyBook>
  );
};
