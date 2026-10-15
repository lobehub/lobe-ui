import { getThemeCss } from '@lobehub/ui';

export async function loader() {
  return new Response(getThemeCss(), {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'text/css; charset=utf-8',
    },
  });
}
