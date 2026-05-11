import { Button, Markdown } from '@lobehub/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Flexbox } from '@/Flex';
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

// ~600 chars/sec — paced slow enough that each section of the report
// (KPI grid, key findings, charts) visibly fades in piece by piece.
// Full document (~11 KB) streams in about 18s.
const CHUNK = 14;
const TICK_MS = 24;

export default () => {
  const [streamed, setStreamed] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsStreaming(false);
  }, []);

  const start = useCallback(() => {
    stop();
    setStreamed('');
    setIsStreaming(true);
    let pos = 0;
    const tick = () => {
      pos = Math.min(pos + CHUNK, article.length);
      setStreamed(article.slice(0, pos));
      if (pos >= article.length) {
        setIsStreaming(false);
        return;
      }
      timerRef.current = setTimeout(tick, TICK_MS);
    };
    timerRef.current = setTimeout(tick, TICK_MS);
  }, [stop]);

  useEffect(() => start(), [start]);
  useEffect(() => () => stop(), [stop]);

  return (
    <Flexbox gap={12}>
      <Flexbox horizontal gap={8}>
        <Button loading={isStreaming} type={'primary'} onClick={start}>
          {isStreaming ? 'Streaming…' : 'Restart streaming'}
        </Button>
        {isStreaming && (
          <Button danger onClick={stop}>
            Stop
          </Button>
        )}
      </Flexbox>
      {/* `enableStream={false}` — bypass the StreamdownRender content
          smoother. For an ~11 KB code block, even the `realtime` preset
          (max ~360 cps in flush mode) throttles the partial HTML so far
          behind the demo's tick that `HtmlPreview` never sees enough
          content to seal its `<head>`. It stays on the loading
          placeholder for the whole stream and pops the finished
          document in at the end. Passing content straight through lets
          the shell iframe morph chunks in as they arrive. */}
      <Markdown
        enableHtmlPreview
        animated={isStreaming}
        componentProps={{ html: { defaultHeight: 1080, theme: 'dark' } }}
        enableStream={false}
      >
        {streamed}
      </Markdown>
    </Flexbox>
  );
};
