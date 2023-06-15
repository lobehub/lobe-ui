import {
  ActionIconGroup,
  ChatItem,
  ChatItemProps,
  StroyBook,
  useControls,
  useCreateStore,
} from '@lobehub/ui';

import { avatar, dropdownMenu, items } from './data';

export default () => {
  const store = useCreateStore();
  const control: ChatItemProps | any = useControls(
    {
      message: {
        value:
          "要使用 dayjs 的 fromNow 函数，需要先安装 dayjs 库并在代码中引入它。然后，可以使用以下语法来获取当前时间与给定时间之间的相对时间：\n\n```javascript\ndayjs().fromNow();\ndayjs('2021-05-01').fromNow();\n```",
        rows: true,
      },
      showTitle: false,
      time: 1686538950084,
      primary: false,
      placement: {
        value: 'left',
        options: ['left', 'right'],
      },
      type: {
        value: 'block',
        options: ['block', 'pure'],
      },
      borderSpacing: true,
      loading: false,
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <ChatItem
        avatar={avatar}
        {...control}
        actions={<ActionIconGroup dropdownMenu={dropdownMenu} items={items} type="ghost" />}
      />
    </StroyBook>
  );
};
