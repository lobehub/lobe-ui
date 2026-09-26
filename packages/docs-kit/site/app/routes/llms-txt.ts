import { loadAssembledAgentDocs } from '../../compiler/agent/loadAgentDocs.server';

export function loader() {
  const { llmsTxt } = loadAssembledAgentDocs();

  return new Response(llmsTxt, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
