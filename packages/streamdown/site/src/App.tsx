import { Streamdown } from '@lobehub/streamdown';
import { useMemo } from 'react';
import remarkGfm from 'remark-gfm';

import { apiReference } from './lib/samples';
import { Hero } from './sections/Hero';
import { Playground } from './sections/Playground';

export const App = () => {
  const remarkPlugins = useMemo(() => [remarkGfm], []);

  return (
    <div className="page">
      <Hero />
      <Playground />
      <footer className="footer sd-typography">
        <Streamdown content={apiReference} remarkPlugins={remarkPlugins} />
        <p className="footnote">
          MIT · <a href="https://github.com/lobehub/lobe-ui">LobeHub</a>
        </p>
      </footer>
    </div>
  );
};
