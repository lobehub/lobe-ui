import { Streamdown } from '@lobehub/streamdown';
import { useMemo } from 'react';
import remarkGfm from 'remark-gfm';

import { markdownComponents } from '../components/CodeBlock';
import { apiReference } from '../lib/samples';

export const ApiSection = () => {
  const remarkPlugins = useMemo(() => [remarkGfm], []);
  const content = useMemo(() => apiReference.replace(/^## API\n+/, ''), []);

  return (
    <section className="api" id="api">
      <div className="section-head">
        <h2>API</h2>
        <p>
          Props on the <code>&lt;Streamdown /&gt;</code> component, rendered by Streamdown itself.
        </p>
      </div>
      <div className="surface api-card sd-typography">
        <Streamdown
          components={markdownComponents}
          content={content}
          remarkPlugins={remarkPlugins}
        />
      </div>
    </section>
  );
};
