'use client';

import {
  createContext,
  type CSSProperties,
  type ReactNode,
  use,
  useMemo,
  useSyncExternalStore,
} from 'react';

import type { NeutralColors, PrimaryColors } from '../customTheme';
import { createLobeToken, type LobeToken } from './createLobeToken';
import { staticToken } from './token/static';

export type LobeAppearance = 'light' | 'dark';

export interface LobeThemeState {
  appearance: LobeAppearance;
  neutralColor?: NeutralColors;
  primaryColor?: PrimaryColors;
}

const ATTRIBUTES = ['data-theme', 'data-primary-color', 'data-neutral-color'];

const toAttributes = ({ appearance, neutralColor, primaryColor }: LobeThemeState) => ({
  'data-neutral-color': neutralColor,
  'data-primary-color': primaryColor,
  'data-theme': appearance,
});

export const setLobeTheme = (
  state: Partial<LobeThemeState>,
  root: HTMLElement = document.documentElement,
) => {
  const next = { ...readThemeState(root), ...state };
  for (const [name, value] of Object.entries(toAttributes(next))) {
    if (value) root.setAttribute(name, value);
    else root.removeAttribute(name);
  }
};

const readThemeState = (el: HTMLElement): LobeThemeState => ({
  appearance: el.dataset.theme === 'dark' ? 'dark' : 'light',
  neutralColor: (el.dataset.neutralColor as NeutralColors) || undefined,
  primaryColor: (el.dataset.primaryColor as PrimaryColors) || undefined,
});

const stateKey = (state: LobeThemeState) =>
  `${state.appearance}|${state.primaryColor ?? ''}|${state.neutralColor ?? ''}`;

const SERVER_STATE: LobeThemeState = { appearance: 'light' };
let rootSnapshot: LobeThemeState = SERVER_STATE;

const getRootSnapshot = () => {
  const next = readThemeState(document.documentElement);
  if (stateKey(next) !== stateKey(rootSnapshot)) rootSnapshot = next;
  return rootSnapshot;
};

const subscribeRoot = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ATTRIBUTES, attributes: true });
  return () => observer.disconnect();
};

const ThemeScopeContext = createContext<LobeThemeState | null>(null);

const useThemeState = () => {
  const scoped = use(ThemeScopeContext);
  const root = useSyncExternalStore(subscribeRoot, getRootSnapshot, () => SERVER_STATE);
  return scoped ?? root;
};

export interface ThemeScopeProps extends Partial<LobeThemeState> {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const ThemeScope = ({
  appearance,
  children,
  className,
  neutralColor,
  primaryColor,
  style,
}: ThemeScopeProps) => {
  const parent = useThemeState();
  const state = useMemo<LobeThemeState>(
    () => ({
      appearance: appearance ?? parent.appearance,
      neutralColor: neutralColor ?? parent.neutralColor,
      primaryColor: primaryColor ?? parent.primaryColor,
    }),
    [appearance, neutralColor, primaryColor, parent],
  );

  return (
    <ThemeScopeContext value={state}>
      <div className={className} style={style} {...toAttributes(state)}>
        {children}
      </div>
    </ThemeScopeContext>
  );
};

export const useThemeMode = () => {
  const { appearance } = useThemeState();
  return useMemo(() => ({ appearance, isDarkMode: appearance === 'dark' }), [appearance]);
};

export type LobeTheme = LobeToken & { appearance: LobeAppearance; isDarkMode: boolean };

const themeCache = new Map<string, LobeTheme>();

export const useTheme = (): LobeTheme => {
  const state = useThemeState();
  const key = stateKey(state);
  let theme = themeCache.get(key);
  if (!theme) {
    theme = {
      ...createLobeToken(state),
      appearance: state.appearance,
      isDarkMode: state.appearance === 'dark',
    };
    themeCache.set(key, theme);
  }
  return theme;
};

const breakpointQueries = {
  lg: `(min-width: ${staticToken.screenLG}px)`,
  md: `(min-width: ${staticToken.screenMD}px)`,
  sm: `(min-width: ${staticToken.screenSM}px)`,
  xl: `(min-width: ${staticToken.screenXL}px)`,
  xs: `(max-width: ${staticToken.screenXSMax}px)`,
  xxl: `(min-width: ${staticToken.screenXXL}px)`,
  xxxl: `(min-width: ${staticToken.screenXXXL}px)`,
};

type Breakpoint = keyof typeof breakpointQueries;
export type ResponsiveState = Record<
  Breakpoint | 'mobile' | 'tablet' | 'laptop' | 'desktop',
  boolean
>;

const toResponsive = (matches: Record<Breakpoint, boolean>): ResponsiveState => ({
  ...matches,
  desktop: matches.xxl,
  laptop: matches.lg,
  mobile: matches.xs,
  tablet: matches.md,
});

const SERVER_RESPONSIVE = toResponsive({
  lg: false,
  md: false,
  sm: false,
  xl: false,
  xs: false,
  xxl: false,
  xxxl: false,
});
let responsiveSnapshot = SERVER_RESPONSIVE;

const getResponsiveSnapshot = () => {
  const matches = Object.fromEntries(
    Object.entries(breakpointQueries).map(([key, query]) => [key, matchMedia(query).matches]),
  ) as Record<Breakpoint, boolean>;
  const changed = (Object.keys(matches) as Breakpoint[]).some(
    (key) => matches[key] !== responsiveSnapshot[key],
  );
  if (changed) responsiveSnapshot = toResponsive(matches);
  return responsiveSnapshot;
};

const subscribeResponsive = (onChange: () => void) => {
  const lists = Object.values(breakpointQueries).map((query) => matchMedia(query));
  for (const list of lists) list.addEventListener('change', onChange);
  return () => {
    for (const list of lists) list.removeEventListener('change', onChange);
  };
};

export const useResponsive = () =>
  useSyncExternalStore(subscribeResponsive, getResponsiveSnapshot, () => SERVER_RESPONSIVE);

export interface LobeThemeScriptProps {
  appearance?: LobeAppearance | 'system';
  neutralColor?: NeutralColors;
  nonce?: string;
  primaryColor?: PrimaryColors;
}

export const LobeThemeScript = ({
  appearance,
  neutralColor,
  nonce,
  primaryColor,
}: LobeThemeScriptProps) => {
  const args = JSON.stringify([appearance ?? null, primaryColor ?? null, neutralColor ?? null]);
  const script = `(function(a,p,n){var d=document.documentElement;if(a==='system')a=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if(a)d.setAttribute('data-theme',a);else if(!d.hasAttribute('data-theme'))d.setAttribute('data-theme','light');if(p)d.setAttribute('data-primary-color',p);if(n)d.setAttribute('data-neutral-color',n);}).apply(null,${args})`;

  return (
    <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} nonce={nonce} />
  );
};
