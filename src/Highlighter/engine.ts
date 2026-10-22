'use client';

import type { Theme } from '@pierre/highlights';
import { useEffect, useState } from 'react';

import lobeHighlightsTheme from './theme/lobe-highlights-theme';

export type HighlightsModule = typeof import('@pierre/highlights');

export const DEFAULT_THEME = 'lobe-theme';

let modulePromise: Promise<HighlightsModule> | undefined;
let loadedModule: HighlightsModule | undefined;

const themePromises = new Map<string, Promise<Theme | undefined>>();
const loadedThemes = new Map<string, Theme>([[DEFAULT_THEME, lobeHighlightsTheme]]);

const loadModule = () => {
  modulePromise ??= import('@pierre/highlights').then((mod) => {
    loadedModule = mod;
    return mod;
  });
  return modulePromise;
};

const loadTheme = (id: string) => {
  const loaded = loadedThemes.get(id);
  if (loaded) return Promise.resolve(loaded);
  let promise = themePromises.get(id);
  if (!promise) {
    promise = import('@pierre/highlights/themes/loader')
      .then(({ themes }) => themes[id]?.())
      .then((mod) => {
        const theme = mod?.default;
        if (theme) loadedThemes.set(id, theme);
        return theme;
      })
      .catch(() => undefined);
    themePromises.set(id, promise);
  }
  return promise;
};

export interface HighlighterEngine {
  highlights: HighlightsModule;
  theme: Theme;
}

const resolveThemeId = (id?: string) => (id && id !== DEFAULT_THEME ? id : DEFAULT_THEME);

const engines = new Map<string, HighlighterEngine>();

const getEngine = (themeId: string): HighlighterEngine | undefined => {
  const cached = engines.get(themeId);
  if (cached) return cached;
  const theme = loadedThemes.get(themeId);
  if (!loadedModule || !theme) return;
  const engine = { highlights: loadedModule, theme };
  engines.set(themeId, engine);
  return engine;
};

export const loadEngine = async (themeId?: string): Promise<HighlighterEngine> => {
  const id = resolveThemeId(themeId);
  await Promise.all([loadModule(), loadTheme(id)]);
  const engine = getEngine(id);
  if (engine) return engine;
  const fallback = getEngine(DEFAULT_THEME)!;
  engines.set(id, fallback);
  return fallback;
};

export const useHighlighterEngine = (themeId?: string): HighlighterEngine | undefined => {
  const id = resolveThemeId(themeId);
  const [, setLoaded] = useState(0);
  const engine = getEngine(id);

  useEffect(() => {
    if (getEngine(id)) return;

    let cancelled = false;
    loadEngine(id)
      .then(() => {
        if (!cancelled) setLoaded((count) => count + 1);
      })
      .catch((error) => {
        console.error('Failed to load syntax highlighter:', error);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return engine;
};
