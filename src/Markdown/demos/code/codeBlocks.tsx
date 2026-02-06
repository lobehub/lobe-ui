import { Markdown, type MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const codeBlocksContent = `\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(userData: Partial<User>): User {
  return {
    id: Math.random(),
    name: '',
    email: '',
    ...userData
  };
}
\`\`\`

**Code blocks in lists**

You can include code blocks within lists:

1. First, install the dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Then, start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: codeBlocksContent,
      },
      fontSize: {
        max: 32,
        min: 12,
        step: 1,
        value: 16,
      },
      fullFeaturedCodeBlock: true,
      headerMultiple: {
        max: 3,
        min: 0,
        step: 0.1,
        value: 1,
      },
      lineHeight: {
        max: 3,
        min: 1,
        step: 0.1,
        value: 1.8,
      },
      marginMultiple: {
        max: 5,
        min: 0,
        step: 0.1,
        value: 2,
      },
    },
    { store },
  ) as MarkdownProps;
  return (
    <StoryBook levaStore={store}>
      <Markdown {...options} />
    </StoryBook>
  );
};
