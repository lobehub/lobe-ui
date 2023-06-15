import { Footer } from '@lobehub/ui';

const data = [
  {
    title: 'Resources',
    items: [
      {
        title: '🤯 Lobe UI',
        description: 'AIGC Components',
        url: 'https://github.com/lobehub/lobe-ui',
        openExternal: true,
      },
      {
        title: '🤯 Lobe Chat',
        description: 'Chatbot Client',
        url: 'https://github.com/lobehub/lobe-chat',
        openExternal: true,
      },
      {
        title: '🤯 Lobe Flow',
        description: 'Node Flow Editor',
        url: 'https://github.com/lobehub/lobe-flow',
        openExternal: true,
      },
    ],
  },
  {
    title: 'More Products',
    items: [
      {
        title: '💌 Lobe Commit',
        description: 'AI Commit CLI',
        url: 'https://github.com/lobehub/lobe-commit',
        openExternal: true,
      },
      {
        title: '📐 Lobe Lint',
        description: 'Lint Config',
        url: 'https://github.com/lobehub/lobe-lint',
        openExternal: true,
      },
    ],
  },
];

export default () => {
  return <Footer bottom="Copyright © 2022" columns={data} />;
};
