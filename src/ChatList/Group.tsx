import { memo, useMemo, useState } from 'react';

import GroupNav from './GroupNav';
import Item, { ChatListItemProps } from './Item';

interface ChatListGroup {
  data: ChatListItemProps[];
  meta: ChatListItemProps['meta'];
}

const Group = memo<ChatListGroup>(({ data, meta }) => {
  const [active, setActive] = useState(data[0].id);

  const chatItem = useMemo(
    () => data.find((item) => item.id === active) || data[0],
    [data, active],
  );

  return (
    <Item
      groupNav={<GroupNav active={active} data={data} setActive={setActive} />}
      {...chatItem}
      meta={meta}
    />
  );
});
export default Group;
