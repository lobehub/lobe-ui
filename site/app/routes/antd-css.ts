import { getAntdStaticCss } from '../antdStaticCss.server';

export async function loader() {
  const { css } = getAntdStaticCss();

  return new Response(css, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'text/css; charset=utf-8',
    },
  });
}
