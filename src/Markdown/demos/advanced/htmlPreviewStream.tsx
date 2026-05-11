import { Button, Markdown } from '@lobehub/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Flexbox } from '@/Flex';

const FULL = `Here's an HTML demo arriving token-by-token. Until the closing \`</html>\` tag is seen the preview falls back to source view — once it stabilizes the iframe mounts.

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
  <h3>Streaming complete</h3>
  <p>This <span class="pill">iframe</span> only booted once \`</html>\` arrived.</p>
  <script>
    document.body.appendChild(Object.assign(document.createElement('p'), {
      textContent: 'Setup ran exactly once — no script re-boot on intermediate tokens.',
    }));
  </script>
</body>
</html>
\`\`\`
`;

const CHUNK = 14;
const TICK_MS = 28;

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
      pos = Math.min(pos + CHUNK, FULL.length);
      setStreamed(FULL.slice(0, pos));
      if (pos >= FULL.length) {
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
      <Markdown enableHtmlPreview animated={isStreaming}>
        {streamed}
      </Markdown>
    </Flexbox>
  );
};
