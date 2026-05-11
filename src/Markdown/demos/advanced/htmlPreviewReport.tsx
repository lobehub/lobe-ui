import { Markdown } from '@lobehub/ui';

import { reportHtml } from '@/HtmlPreview/demos/reportHtml';

// Wrap the self-contained "Weekly product report" in a Markdown context.
// This is the canonical "model produced a complete document" case — the
// agent's prose frames the artifact, and the artifact itself renders
// inline as an isolated sandbox iframe via `enableHtmlPreview`.
const article = `Here's the **weekly product report** the analytics agent generated. The whole
artifact — KPIs, charts, event log — arrives as a single HTML document and
renders inline below.

\`\`\`html
${reportHtml}\`\`\`

The agent prefers HTML over a Markdown table for this kind of dashboard because
inline SVG carries the charts, CSS Grid handles the layout, and the result is
self-contained: paste the source into any browser and it renders identically.
`;

export default () => (
  <Markdown enableHtmlPreview componentProps={{ html: { defaultHeight: 1080, theme: 'dark' } }}>
    {article}
  </Markdown>
);
