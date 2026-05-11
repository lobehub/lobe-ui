import { Markdown } from '@lobehub/ui';

const content = `
Here's an inline HTML preview rendered straight from a code fence.

\`\`\`html
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

A fragment without an \`<html>\` wrapper falls through to the regular code block:

\`\`\`html
<button onclick="alert('hi')">fragment</button>
\`\`\`
`;

export default () => {
  return (
    <Markdown enableHtmlPreview fullFeaturedCodeBlock>
      {content}
    </Markdown>
  );
};
