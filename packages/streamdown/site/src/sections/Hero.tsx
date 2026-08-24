import { Streamdown } from '@lobehub/streamdown';
import { useMemo, useState } from 'react';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { heroSample } from '../lib/samples';
import { useLocalStream } from '../lib/useLocalStream';

const INSTALL_COMMAND = 'pnpm add @lobehub/streamdown';

export const Hero = () => {
  const { text } = useLocalStream(heroSample, { chunkSize: 8, delayMs: 60, loop: true });
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);
  const [copied, setCopied] = useState(false);

  const copyInstall = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="hero">
      <div className="hero-intro">
        <h1>Streamdown</h1>
        <p className="tagline">
          Headless streaming markdown engine for React. Smooth per-character reveal, block-level
          caching, LaTeX guarding — zero UI dependencies.
        </p>
        <div className="install">
          <code>{INSTALL_COMMAND}</code>
          <button type="button" onClick={copyInstall}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="hero-links">
          <a href="https://github.com/lobehub/lobe-ui/tree/master/packages/streamdown">GitHub</a>
          <a href="https://www.npmjs.com/package/@lobehub/streamdown">npm</a>
        </div>
      </div>
      <div className="hero-demo sd-typography">
        <Streamdown
          latexGuard
          content={text}
          rehypePlugins={rehypePlugins}
          remarkPlugins={remarkPlugins}
        />
      </div>
    </header>
  );
};
