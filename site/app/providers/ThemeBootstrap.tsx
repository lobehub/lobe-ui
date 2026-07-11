import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY } from './themeStore';

export const THEME_BOOTSTRAP_SCRIPT = `(() => {
  let preference = 'system';
  try {
    const stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (stored === 'light' || stored === 'system' || stored === 'dark') preference = stored;
  } catch {}
  let appearance = preference;
  if (preference === 'system') {
    appearance = 'light';
    try {
      if (matchMedia(${JSON.stringify(THEME_MEDIA_QUERY)}).matches) appearance = 'dark';
    } catch {}
  }
  const root = document.documentElement;
  root.dataset.theme = appearance;
  root.style.colorScheme = appearance;
})();`;

export default function ThemeBootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />;
}
