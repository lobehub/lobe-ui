import { Markdown, type MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const htmlContent = `\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 24px; font-family: sans-serif; background: #0f172a; color: #f8fafc; }
    .pill { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #22d3ee; color: #0f172a; }
  </style>
</head>
<body>
  <h3>Hello from inside Markdown</h3>
  <p>This block is rendered by <span class="pill">HtmlPreview</span>.</p>
  <script>
    document.body.appendChild(Object.assign(document.createElement('p'), {
      textContent: 'Scripts run inside an isolated sandbox iframe.',
    }));
  </script>
</body>
</html>
\`\`\`
`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: htmlContent,
      },
      enableHtmlPreview: true,
      fullFeaturedCodeBlock: true,
    },
    { store },
  ) as MarkdownProps;
  return (
    <StoryBook levaStore={store}>
      <Markdown {...options} />
    </StoryBook>
  );
};
