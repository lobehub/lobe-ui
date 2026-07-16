export const THEME_STORAGE_KEY = 'lobe-ui-docs-theme';

export type PrefersColor = 'auto' | 'dark' | 'light';

export const createThemeInitScript = (prefersColor: PrefersColor = 'auto'): string => {
  const fallback =
    prefersColor === 'auto'
      ? `matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'`
      : `'${prefersColor}'`;
  return `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='dark'&&t!=='light'){t=${fallback}}var e=document.documentElement;e.dataset.theme=t;e.style.colorScheme=t}catch(e){}})();`;
};
