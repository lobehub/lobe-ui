import { ChatMessage } from '@/types/chatMessage';

export const data: ChatMessage[] = [
  {
    content: 'dayjs 如何使用 fromNow',
    createAt: 1_686_437_950_084,
    id: '1',
    meta: {
      avatar: 'https://avatars.githubusercontent.com/u/17870709?v=4',
      title: 'CanisMinor',
    },
    role: 'user',
    updateAt: 1_686_437_950_084,
  },
  {
    content:
      '要使用 dayjs 的 fromNow 函数，需要先安装 dayjs 库并在代码中引入它。然后，可以使用以下语法来获取当前时间与给定时间之间的相对时间：\n\n```javascript\ndayjs().fromNow(); // 获取当前时间的相对时间\ndayjs(\'2021-05-01\').fromNow(); // 获取给定时间的相对时间\n```\n\n第一个示例将返回类似于 "几秒前"、"一分钟前"、"2 天前" 的相对时间字符串，表示当前时间与调用 fromNow 方法时的时间差。第二个示例将返回给定时间与当前时间的相对时间字符串。',
    createAt: 1_686_538_950_084,
    id: '2',
    meta: {
      avatar: '😎',
      backgroundColor: '#E8DA5A',
      title: 'Advertiser',
    },
    role: 'assistant',
    updateAt: 1_686_538_950_084,
  },
];
