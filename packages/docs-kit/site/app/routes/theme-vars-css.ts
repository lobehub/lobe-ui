import { getThemeVarsCss } from '../themeVarsCss';

export async function loader() {
  const css = getThemeVarsCss();

  return new Response(css, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'text/css; charset=utf-8',
    },
  });
}
