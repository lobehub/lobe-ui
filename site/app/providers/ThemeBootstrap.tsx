import { THEME_STORAGE_KEY } from './themeConstants';

export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}var e=document.documentElement;e.dataset.theme=t;e.style.colorScheme=t}catch(e){}})();`;

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
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: STANDALONE_APPEARANCE_SCRIPT }} />
    </>
  );
}
