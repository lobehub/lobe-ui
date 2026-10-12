import { useEffect, useState } from 'react';

type LoadI18n = (language: string) => Promise<unknown>;

export const createEmojiMartI18nLoader = (load: LoadI18n) => {
  const cache = new Map<string, Promise<unknown>>();

  const useEmojiMartI18n = (locale: string): unknown => {
    const language = locale.split('-')[0];
    const [loaded, setLoaded] = useState<{ language: string; value: unknown }>();

    useEffect(() => {
      let active = true;
      let pending = cache.get(language);
      if (!pending) {
        pending = load(language);
        cache.set(language, pending);
      }
      pending.then(
        (value) => {
          if (active) setLoaded({ language, value });
        },
        () => {},
      );
      return () => {
        active = false;
      };
    }, [language]);

    return loaded?.language === language ? loaded.value : undefined;
  };

  return useEmojiMartI18n;
};

export const useEmojiMartI18n = createEmojiMartI18nLoader(
  (language) => import(/* @vite-ignore */ `@emoji-mart/data/i18n/${language}.json`),
);
