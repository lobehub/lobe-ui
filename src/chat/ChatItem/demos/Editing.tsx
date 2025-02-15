import { ChatItem } from '@lobehub/ui/chat';

import { avatar } from './data';

const data = {
  loading: false,
  message:
    "要使用 dayjs 的 fromNow 函数，需要先安装 dayjs 库并在代码中引入它。然后，可以使用以下语法来获取当前时间与给定时间之间的相对时间：\n\n```javascript\ndayjs().fromNow();\ndayjs('2021-05-01').fromNow();\n```",
  time: 1_686_538_950_084,
};
export default () => {
  return <ChatItem {...data} avatar={avatar} editing={true} />;
};
