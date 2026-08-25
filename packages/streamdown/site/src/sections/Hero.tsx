import { Streamdown } from '@lobehub/streamdown';
import { useMemo, useState } from 'react';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { markdownComponents } from '../components/CodeBlock';
import { heroSample } from '../lib/samples';
import { useLocalStream } from '../lib/useLocalStream';
import { useStickToBottom } from '../lib/useStickToBottom';

const INSTALL_COMMAND = 'pnpm add @lobehub/streamdown';

export const Hero = () => {
  const { text } = useLocalStream(heroSample, { chunkSize: 6, delayMs: 24 });
  const { onScroll, ref } = useStickToBottom();
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);
  const [copied, setCopied] = useState(false);

  const copyInstall = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="hero">
      <span className="hero-pill">
        <b>New</b> Block-level caching, 2× less main-thread time
      </span>
      <h1>
        Render markdown
        <br />
        as it arrives
      </h1>
      <p className="hero-lede">
        A headless streaming markdown engine for React. Per-character reveal, block-level caching,
        and a LaTeX guard that keeps half-typed math from breaking mid-stream. Ships zero styles.
      </p>
      <div className="hero-cta">
        <a className="btn btn-primary" href="#playground">
          Try the playground
        </a>
        <button className="btn btn-ghost" type="button" onClick={copyInstall}>
          <code>{INSTALL_COMMAND}</code>
          <span className="copy-state">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      <div className="surface hero-demo">
        <div className="surface-bar">
          <span>heroSample.md</span>
          <span className="surface-bar-spacer" />
          <span className="live-dot">
            <i />
            streaming
          </span>
        </div>
        <div className="stream-pane sd-typography" ref={ref} onScroll={onScroll}>
          <Streamdown
            latexGuard
            components={markdownComponents}
            content={text}
            rehypePlugins={rehypePlugins}
            remarkPlugins={remarkPlugins}
          />
        </div>
      </div>
    </section>
  );
};
