import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { CodeDiff } from '../CodeDiff';
import type { CodeDiffProps } from '../type';

const oldCode = `function createUser(name) {
  return {
    id: Date.now(),
    name,
  };
}

const user = createUser('Ada');
console.log(user);`;

const newCode = `interface User {
  id: number;
  name: string;
  createdAt: string;
}

function createUser(name: string): User {
  return {
    id: Date.now(),
    name,
    createdAt: new Date().toISOString(),
  };
}

const user = createUser('Ada');
console.log(user.createdAt);`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      defaultExpand: true,
      fileName: 'user.ts',
      fullFeatured: true,
      language: 'typescript',
      showHeader: true,
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
      viewMode: {
        options: ['split', 'unified'],
        value: 'split',
      },
    },
    { store },
  ) as CodeDiffProps;

  return (
    <StoryBook levaStore={store}>
      <CodeDiff {...options} newContent={newCode} oldContent={oldCode} />
    </StoryBook>
  );
};
