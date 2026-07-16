import { createThemeInitScript, type PrefersColor } from './themeConstants';

export const THEME_INIT_SCRIPT = createThemeInitScript('auto');

export const STANDALONE_APPEARANCE_SCRIPT = `(() => {
  try {
    if (location.pathname === '/~demos' || location.pathname.startsWith('/~demos/')) {
      var e = document.documentElement;
      var appearance = new URLSearchParams(location.search).get('appearance');
      e.dataset.standaloneAppearance =
        appearance === 'light' || appearance === 'dark'
          ? appearance
          : e.dataset.theme === 'dark' ? 'dark' : 'light';
    }
  } catch {}
})();`;

export function ThemeBootstrap({ prefersColor = 'auto' }: { prefersColor?: PrefersColor } = {}) {
  const initScript =
    prefersColor === 'auto' ? THEME_INIT_SCRIPT : createThemeInitScript(prefersColor);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: initScript }} />
      <script dangerouslySetInnerHTML={{ __html: STANDALONE_APPEARANCE_SCRIPT }} />
    </>
  );
}
