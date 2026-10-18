'use client';

import clsx from 'clsx';
import {
  createContext,
  type CSSProperties,
  type ReactNode,
  use,
  useMemo,
  useSyncExternalStore,
} from 'react';

import { createLobeToken, type LobeToken } from './createLobeToken';
import { isCustomNeutral, type LobeNeutralColor } from './customNeutral';
import { getPaletteRevision, isRegisteredPalette, subscribePalettes } from './customPalette';
import {
  type CustomPrimaryColor,
  isCustomPrimaryColor,
  type LobePrimaryColor,
} from './customPrimary';
import { themeScopeClasses } from './stable';
import {
  getCustomNeutralCss,
  getCustomPaletteCss,
  getCustomPrimaryCss,
  getPaletteNeutralCss,
} from './themeCss';
import { staticToken } from './token/static';

export type LobeAppearance = 'light' | 'dark';

export interface LobeThemeState {
  appearance: LobeAppearance;
  neutralColor?: LobeNeutralColor;
  palette?: string;
  primaryColor?: LobePrimaryColor;
}

const ATTRIBUTES = ['data-theme', 'data-primary-color', 'data-neutral-color', 'data-palette'];

const toAttributes = ({ appearance, neutralColor, palette, primaryColor }: LobeThemeState) => ({
  'data-neutral-color': neutralColor,
  'data-palette': palette,
  'data-primary-color': primaryColor,
  'data-theme': appearance,
});

const normalizePrimary = (color?: LobePrimaryColor) =>
  isCustomPrimaryColor(color) ? (color.toLowerCase() as CustomPrimaryColor) : color;

const customPrimaryStyleId = (color: CustomPrimaryColor) => `lobe-primary-${color.slice(1)}`;

const ensureCustomPrimaryStyle = (color: CustomPrimaryColor, doc: Document) => {
  const id = customPrimaryStyleId(color);
  if (doc.getElementById(id)) return;
  const style = doc.createElement('style');
  style.id = id;
  style.textContent = getCustomPrimaryCss(color);
  doc.head.append(style);
};

const normalizeNeutral = (color?: LobeNeutralColor) =>
  color?.startsWith('#') ? color.toLowerCase() : color;

/** Encodes hex vs registered name so `#0e1010` and a neutral named `0e1010` never collide. */
const neutralKey = (value: string) =>
  value.startsWith('#') ? `hex-${value.slice(1)}` : `name-${value}`;

const neutralStyleId = (value: string) => `lobe-neutral-${neutralKey(value)}`;

/** Written every time (a re-registered neutral must replace its old rules). */
const ensureNeutralStyle = (value: string, doc: Document) => {
  const id = neutralStyleId(value);
  let style = doc.getElementById(id);
  if (!style) {
    style = doc.createElement('style');
    style.id = id;
    doc.head.append(style);
  }
  const css = getCustomNeutralCss(value);
  if (style.textContent !== css) style.textContent = css;
};

const paletteStyleId = (name: string) => `lobe-palette-${name}`;

const ensurePaletteStyle = (name: string, doc: Document) => {
  const id = paletteStyleId(name);
  let style = doc.getElementById(id);
  if (!style) {
    style = doc.createElement('style');
    style.id = id;
    doc.head.append(style);
  }
  const css = getCustomPaletteCss(name);
  if (style.textContent !== css) style.textContent = css;
};

const paletteNeutralStyleId = (name: string, neutral: string) =>
  `lobe-palette-${name}--neutral-${neutralKey(neutral)}`;

const ensurePaletteNeutralStyle = (name: string, neutral: string, doc: Document) => {
  const id = paletteNeutralStyleId(name, neutral);
  let style = doc.getElementById(id);
  if (!style) {
    style = doc.createElement('style');
    style.id = id;
    doc.head.append(style);
  }
  const css = getPaletteNeutralCss(name, neutral);
  if (style.textContent !== css) style.textContent = css;
};

export const setLobeTheme = (
  state: Partial<LobeThemeState>,
  root: HTMLElement = document.documentElement,
) => {
  const next = { ...readThemeState(root), ...state };
  next.primaryColor = normalizePrimary(next.primaryColor);
  if (isCustomPrimaryColor(next.primaryColor))
    ensureCustomPrimaryStyle(next.primaryColor, root.ownerDocument);
  next.neutralColor = normalizeNeutral(next.neutralColor);
  if (isCustomNeutral(next.neutralColor)) ensureNeutralStyle(next.neutralColor, root.ownerDocument);
  if (isRegisteredPalette(next.palette)) {
    ensurePaletteStyle(next.palette, root.ownerDocument);
    if (next.neutralColor)
      ensurePaletteNeutralStyle(next.palette, next.neutralColor, root.ownerDocument);
  }
  for (const [name, value] of Object.entries(toAttributes(next))) {
    if (value) root.setAttribute(name, value);
    else root.removeAttribute(name);
  }
};

const readThemeState = (el: HTMLElement): LobeThemeState => ({
  appearance: el.dataset.theme === 'dark' ? 'dark' : 'light',
  neutralColor: el.dataset.neutralColor || undefined,
  palette: el.dataset.palette || undefined,
  primaryColor: (el.dataset.primaryColor as LobePrimaryColor) || undefined,
});

const stateKey = (state: LobeThemeState) =>
  `${state.appearance}|${state.primaryColor ?? ''}|${state.neutralColor ?? ''}|${state.palette ?? ''}`;

const usePaletteRevision = () =>
  useSyncExternalStore(subscribePalettes, getPaletteRevision, getPaletteRevision);

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
  palette,
  primaryColor,
  style,
}: ThemeScopeProps) => {
  const parent = useThemeState();
  const state = useMemo<LobeThemeState>(
    () => ({
      appearance: appearance ?? parent.appearance,
      neutralColor: normalizeNeutral(neutralColor) ?? parent.neutralColor,
      palette: palette ?? parent.palette,
      primaryColor: normalizePrimary(primaryColor) ?? parent.primaryColor,
    }),
    [appearance, neutralColor, palette, primaryColor, parent],
  );
  const customPrimary = isCustomPrimaryColor(state.primaryColor) ? state.primaryColor : undefined;
  const paletteRevision = usePaletteRevision();
  const customPalette = isRegisteredPalette(state.palette) ? state.palette : undefined;
  const customNeutral = isCustomNeutral(state.neutralColor) ? state.neutralColor : undefined;

  return (
    <ThemeScopeContext value={state}>
      {customPrimary && (
        <style href={customPrimaryStyleId(customPrimary)} precedence="lobe-theme">
          {getCustomPrimaryCss(customPrimary)}
        </style>
      )}
      {customNeutral && (
        <style href={`${neutralStyleId(customNeutral)}-${paletteRevision}`} precedence="lobe-theme">
          {getCustomNeutralCss(customNeutral)}
        </style>
      )}
      {customPalette && (
        <style href={`${paletteStyleId(customPalette)}-${paletteRevision}`} precedence="lobe-theme">
          {getCustomPaletteCss(customPalette)}
        </style>
      )}
      {customPalette && state.neutralColor && (
        <style
          href={`${paletteNeutralStyleId(customPalette, state.neutralColor)}-${paletteRevision}`}
          precedence="lobe-theme"
        >
          {getPaletteNeutralCss(customPalette, state.neutralColor)}
        </style>
      )}
      <div className={clsx(themeScopeClasses(), className)} style={style} {...toAttributes(state)}>
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
  const key = `${stateKey(state)}@${usePaletteRevision()}`;
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
  neutralColor?: LobeNeutralColor;
  nonce?: string;
  palette?: string;
  primaryColor?: LobePrimaryColor;
}

export const LobeThemeScript = ({
  appearance,
  neutralColor,
  nonce,
  palette,
  primaryColor,
}: LobeThemeScriptProps) => {
  const primary = normalizePrimary(primaryColor);
  const styles: [string, string][] = [];
  if (isCustomPrimaryColor(primary))
    styles.push([customPrimaryStyleId(primary), getCustomPrimaryCss(primary)]);
  const neutral = normalizeNeutral(neutralColor);
  if (isCustomNeutral(neutral))
    styles.push([neutralStyleId(neutral), getCustomNeutralCss(neutral)]);
  if (isRegisteredPalette(palette)) {
    styles.push([paletteStyleId(palette), getCustomPaletteCss(palette)]);
    if (neutral)
      styles.push([
        paletteNeutralStyleId(palette, neutral),
        getPaletteNeutralCss(palette, neutral),
      ]);
  }
  const args = JSON.stringify([
    appearance ?? null,
    primary ?? null,
    neutral ?? null,
    palette ?? null,
    styles,
  ]);
  const script = `(function(a,p,n,q,t){var d=document.documentElement;if(a==='system')a=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if(a)d.setAttribute('data-theme',a);else if(!d.hasAttribute('data-theme'))d.setAttribute('data-theme','light');if(p)d.setAttribute('data-primary-color',p);if(n)d.setAttribute('data-neutral-color',n);if(q)d.setAttribute('data-palette',q);t.forEach(function(x){if(document.getElementById(x[0]))return;var s=document.createElement('style');s.id=x[0];s.textContent=x[1];document.head.appendChild(s);});}).apply(null,${args})`;

  return (
    <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} nonce={nonce} />
  );
};
