import { Button, Markdown } from '@lobehub/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Flexbox } from '@/Flex';

const article = `# Why HTML beats Markdown for reports

When a model needs to communicate something dense — a spec, a code review,
a tuning playground — Markdown can only stretch so far. **HTML lets you
mix prose, layout, and live widgets in the same document**, which is
exactly what an LLM tends to want to produce.

## Side-by-side mockup

Here's a checkout-button playground rendered straight from the model's
HTML output. The preview iframe streams live alongside the surrounding
prose — no waiting for the closing tag.

\`\`\`html
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; padding: 20px; font-family: ui-sans-serif, system-ui, sans-serif; background: #fafaf7; color: #1a1a1a; }
  .stage { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .panel { padding: 16px; border-radius: 12px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .panel h3 { margin: 0 0 12px; font-size: 14px; font-weight: 600; }
  .row { display: flex; align-items: center; justify-content: space-between; margin-block: 10px; font-size: 13px; color: #555; }
  .bar { width: 60%; height: 6px; border-radius: 999px; background: #eee; position: relative; }
  .bar > i { display: block; height: 100%; border-radius: 999px; background: #e07a5f; }
  .terminal { background: #0d0d0d; color: #d6d6d6; font-family: ui-monospace, monospace; font-size: 12px; line-height: 1.6; }
  .terminal h3 { color: #9aa0a6; font-weight: 500; }
  .terminal .k { color: #9aa0a6; }
  .terminal .v { color: #e07a5f; }
  .btn { margin-top: 12px; padding: 8px 14px; border-radius: 8px; border: none; background: #e07a5f; color: #fff; font-size: 13px; cursor: pointer; }
</style>
</head>
<body>
  <div class="stage">
    <div class="panel">
      <h3>checkout-button.html</h3>
      <div class="row">duration<div class="bar"><i style="width:72%"></i></div></div>
      <div class="row">scale<div class="bar"><i style="width:38%"></i></div></div>
      <div class="row">shadow blur<div class="bar"><i style="width:48%"></i></div></div>
      <button class="btn">Copy as prompt</button>
    </div>
    <div class="panel terminal">
      <h3>claude code</h3>
      <div>&gt; apply these to the real CheckoutButton component:</div>
      <div><span class="k">duration:</span> <span class="v">220ms</span></div>
      <div><span class="k">scale:</span> <span class="v">1.04</span></div>
      <div><span class="k">shadow:</span> <span class="v">8px</span></div>
      <div><span class="k">easing:</span> <span class="v">spring</span></div>
      <div style="margin-top:10px">Updating CheckoutButton.tsx with the tuned values…</div>
    </div>
  </div>
</body>
</html>
\`\`\`

> Tune in the browser, paste the result back into the agent.

## Two-way interaction

HTML lets you interact with the document — sliders, knobs, toggles. You
can ask the model to add controls to a design, tweak the parameters, and
copy the resulting state back into a prompt.

\`\`\`html
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; padding: 20px; font-family: ui-sans-serif, system-ui, sans-serif; background: #0f172a; color: #e2e8f0; }
  .card { padding: 16px; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
  .pill { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #22d3ee; color: #0f172a; font-size: 11px; font-weight: 600; }
  .row { display: flex; gap: 8px; align-items: center; margin-block: 8px; }
  .row label { width: 90px; font-size: 12px; color: #94a3b8; }
  .row input[type=range] { flex: 1; accent-color: #22d3ee; }
</style>
</head>
<body>
  <div class="card">
    <span class="pill">interactive</span>
    <h3 style="margin:12px 0 8px">Spring tuning</h3>
    <div class="row"><label>tension</label><input type="range" min="0" max="500" value="220"></div>
    <div class="row"><label>friction</label><input type="range" min="0" max="50" value="26"></div>
    <div class="row"><label>mass</label><input type="range" min="1" max="20" value="1"></div>
  </div>
</body>
</html>
\`\`\`

Either widget streams live as content arrives — neither one has \`<script>\`,
so \`streamingMode: 'auto'\` lets the iframe paint progressively. When the
model *does* include a script tag, the preview defers until the closing
\`</html>\` arrives, so things like \`p5.js\` \`setup()\` run exactly once.
`;

// ~400 chars/sec — closer to a fast model. Full article in ~12s, body of
// each HTML block in ~3-4s → roughly 12-16 throttled commits at 250ms.
const CHUNK = 16;
const TICK_MS = 40;

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
      <Markdown enableHtmlPreview animated={isStreaming} streamSmoothingPreset={'realtime'}>
        {streamed}
      </Markdown>
    </Flexbox>
  );
};
