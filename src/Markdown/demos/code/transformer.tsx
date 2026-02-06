import { Markdown, type MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const code = `**Code Diff**

\`\`\`ts
export function greetUser(name: string) {
  console.log('hewwo ' + name) // [!code --]
  console.log('Hello ' + name) // [!code ++]
  return \`Welcome, \${name}!\`
}
\`\`\`

**Code Highlighting**

\`\`\`ts
export function calculateTotal(items: Item[]) {
  let total = 0
  console.log('Calculating total...') // [!code highlight]

  for (const item of items) {
    total += item.price
  }

  return total
}
\`\`\`

**Code Focus**

\`\`\`ts
export function authenticateUser(credentials: Credentials) {
  const isValid = validateCredentials(credentials)

  if (isValid) {
    return generateToken(credentials.userId) // [!code focus]
  }

  throw new Error('Invalid credentials')
}
\`\`\`
`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: code,
      },
      fullFeaturedCodeBlock: true,
    },
    { store },
  ) as MarkdownProps;

  return (
    <StoryBook levaStore={store}>
      <Markdown
        componentProps={{
          highlight: {
            enableTransformer: true,
          },
        }}
        {...options}
      />
    </StoryBook>
  );
};
