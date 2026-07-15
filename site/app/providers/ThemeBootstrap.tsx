export const STANDALONE_APPEARANCE_SCRIPT = `(() => {
  try {
    if (location.pathname === '/~demos' || location.pathname.startsWith('/~demos/')) {
      const appearance = new URLSearchParams(location.search).get('appearance');
      if (appearance === 'light' || appearance === 'dark') {
        document.documentElement.dataset.standaloneAppearance = appearance;
      }
    }
  } catch {}
})();`;

export function ThemeBootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: STANDALONE_APPEARANCE_SCRIPT }} />;
}
