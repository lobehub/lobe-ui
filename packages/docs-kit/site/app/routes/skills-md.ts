import { loadAssembledAgentDocs } from '../../compiler/agent/loadAgentDocs.server';

export function loader() {
  const { skillsMd } = loadAssembledAgentDocs();

  return new Response(skillsMd, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
