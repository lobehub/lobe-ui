import type { LoaderFunctionArgs } from 'react-router';

import { AGENT_PAGE_BASE_PATHNAME } from '../../compiler/agent/assembleAgentDocs';
import { loadAssembledAgentDocs } from '../../compiler/agent/loadAgentDocs.server';

export function loader({ params }: LoaderFunctionArgs) {
  const pathname = `${AGENT_PAGE_BASE_PATHNAME}/${params['*'] ?? ''}`;
  const page = loadAssembledAgentDocs().pages.find((entry) => entry.pathname === pathname);
  if (!page) throw new Response('Not Found', { status: 404 });

  return new Response(page.markdown, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
