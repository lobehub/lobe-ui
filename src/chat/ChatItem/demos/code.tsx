import { ActionIconGroup } from '@lobehub/ui';
import { ChatItem } from '@lobehub/ui/chat';
import { useState } from 'react';

import { longCode } from './code';
import { avatar, dropdownMenu, items } from './data';

export default () => {
  const [edit, setEdit] = useState(false);

  return (
    <ChatItem
      actions={
        <ActionIconGroup
          items={items}
          menu={dropdownMenu}
          onActionClick={(action) => {
            if (action.key === 'edit') {
              setEdit(true);
            }
          }}
        />
      }
      avatar={avatar}
      editing={edit}
      message={longCode}
      onEditingChange={(editing) => {
        console.log('editing:', editing);
        setEdit(editing);
      }}
    />
  );
};
