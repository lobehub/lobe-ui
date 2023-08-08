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

export const groupData: ChatMessage[] = [
  {
    content: '树干被台风刮断，还有救么?',
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
    children: [
      {
        content:
          '如果树干被台风刮断，取决于切断的位置和树木的状况，可能有救的机会。以下是一些可能的处理方法：\n' +
          '\n' +
          '1. 观察树木的情况：如果树木的主干仍然有一定程度的稳定性，并且树冠完好无损，那么树木可能有恢复的机会。\n' +
          '\n' +
          '2. 修剪受损的部分：如果树木的主干被切断，但仍有一些侧枝或分支保留，可以考虑修剪受损的部分，使其更加均匀和平衡。\n' +
          '\n' +
          '3. 支撑树干：如果树木的主干被切断但仍然有一定的稳定性，可以使用支撑物（如木桩或金属支架）来支撑树干，以防止进一步倒塌。\n' +
          '\n' +
          '4. 提供适当的养护：为树木提供充足的水分、养分和阳光，以促进新的生长和恢复。\n' +
          '\n' +
          '5. 请专业人士帮助：如果您对如何处理被刮断的树干不确定，最好咨询专业的园艺师或树木专家，以获取更准确的建议和指导。\n' +
          '\n' +
          '需要注意的是，树木的恢复能力因树种和受损程度而异。在一些情况下，树木可能无法完全恢复，可能需要考虑移除树木并重新种植。',
        createAt: 1_686_538_950_084,
        id: '3',
        meta: {
          title: 'Advertiser',
        },
        role: 'assistant',
        updateAt: 1_686_538_950_084,
      },
      {
        content:
          '如果树干被台风刮断，是否还有救取决于具体情况。以下是一些建议：\n' +
          '\n' +
          '评估树木的状况：检查树干是否完全断裂，如果只是部分断裂，可能还有机会修复。如果树干完全断裂，可能需要采取其他措施。\n' +
          '\n' +
          '寻求专业帮助：如果你不确定如何处理树木，最好寻求专业的园艺师或树木专家的建议。他们可以评估树木的状况，并提供适当的处理建议。\n' +
          '\n' +
          '修剪和修复：如果树干只是部分断裂，可以考虑修剪断裂的部分，并使用合适的工具和材料进行修复。这可能需要专业人员的帮助。\n' +
          '\n' +
          '树木移植：如果树木的根部完好无损，并且树干的伤势不是太严重，可以考虑将树木移植到一个更安全的地方，以便给予树木更好的恢复机会。\n' +
          '\n' +
          '总之，树干被台风刮断后，是否还有救取决于具体情况和树木的状况。最好寻求专业帮助，以便采取适当的措施来拯救树木。',
        createAt: 1_686_538_950_084,
        id: '4',
        meta: {
          title: 'Advertiser',
        },
        role: 'assistant',
        updateAt: 1_686_538_950_084,
      },
      {
        content: 'asfadsfdsafdsafdsafdafdafdsafsa',
        createAt: 1_686_538_950_084,
        id: '5',
        meta: {
          title: 'Advertiser',
        },
        role: 'function',
        updateAt: 1_686_538_950_084,
      },
    ],
    content: '',
    createAt: 1_686_538_950_084,
    id: '3',
    meta: {
      avatar: '😎',
      backgroundColor: '#E8DA5A',
      title: 'Advertiser',
    },
    parentId: '1',
    role: 'assistant',
    updateAt: 1_686_538_950_084,
  },
];
