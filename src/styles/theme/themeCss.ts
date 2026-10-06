import { toCssVariables,toCssVarName } from '../css';
import { neutralColors, primaryColors } from '../customTheme';
import { createLobeTokenGroups } from './createLobeToken';
import type { LobeAppearance } from './scope';

const v = (key: string) => `var(${toCssVarName(key)})`;

const ring: Record<LobeAppearance, string> = {
  dark: '0 0 0 1px rgb(255 255 255 / 18%)',
  light: '0 0 0 1px rgb(0 0 0 / 5%)',
};

const rule = (selector: string, declarations: Record<string, number | string>) =>
  `${selector} {\n${Object.entries(declarations)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')}\n}`;

const appearanceRule = (selector: string, appearance: LobeAppearance) => {
  const { neutral, palette, primary, static: base } = createLobeTokenGroups({ appearance });
  const token =
    appearance === 'light'
      ? { ...base, ...palette, ...primary, ...neutral }
      : { ...palette, ...primary, ...neutral };

  return rule(selector, {
    ...toCssVariables(token),
    '--lobe-ring': ring[appearance],
    'color-scheme': appearance,
  });
};

const appearanceSelector = (appearance: LobeAppearance) =>
  appearance === 'dark' ? "[data-theme='dark']" : ":not([data-theme='dark'])";

const colorRules = (appearance: LobeAppearance) => [
  ...(Object.keys(primaryColors) as (keyof typeof primaryColors)[]).map((primaryColor) =>
    rule(
      `[data-primary-color='${primaryColor}']${appearanceSelector(appearance)}`,
      toCssVariables(createLobeTokenGroups({ appearance, primaryColor }).primary),
    ),
  ),
  ...(Object.keys(neutralColors) as (keyof typeof neutralColors)[]).map((neutralColor) =>
    rule(
      `[data-neutral-color='${neutralColor}']${appearanceSelector(appearance)}`,
      toCssVariables(createLobeTokenGroups({ appearance, neutralColor }).neutral),
    ),
  ),
];

const globalCss = `@layer lobe-ui {
  :root {
    --font-settings: 'cv01', 'tnum', 'kern';
    --font-variations: 'opsz' auto, tabular-nums;

    font-synthesis: style;
    text-autospace: normal;
  }

  html {
    overscroll-behavior: none;
  }

  body {
    overflow: hidden auto;

    min-height: 100vh;
    margin: 0;
    padding: 0;

    font-family: ${v('fontFamily')};
    font-size: ${v('fontSize')};
    font-feature-settings: var(--font-settings);
    font-variation-settings: var(--font-variations);
    font-optical-sizing: auto;
    font-kerning: normal;
    font-variant-ligatures: common-ligatures contextual;
    font-variant-numeric: tabular-nums;
    font-size-adjust: from-font;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1;
    color: ${v('colorTextBase')};
    text-wrap: pretty;
    text-size-adjust: 100%;
    text-rendering: optimizelegibility;
    overflow-wrap: anywhere;
    vertical-align: baseline;

    background-color: ${v('colorBgLayout')};

    font-synthesis: style;

    -webkit-overflow-scrolling: touch;
    -webkit-tap-highlight-color: transparent;
  }

  code,
  kbd,
  samp,
  pre {
    font-family: ${v('fontFamilyCode')} !important;
    font-feature-settings:
      'liga' 0,
      'calt' 0;
    font-variant-ligatures: none;

    span {
      font-family: ${v('fontFamilyCode')} !important;
    }
  }

  ::selection {
    color: #000;
    background: ${v('yellow9')};

    -webkit-text-fill-color: unset !important;
  }

  * {
    scrollbar-color: ${v('colorFill')} transparent;
    scrollbar-width: thin;
    box-sizing: border-box;
    vertical-align: baseline;
  }

  .lobe-brand-loading path {
    fill: currentcolor;
    fill-opacity: 0;
    stroke: currentcolor;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    stroke-width: 0.25em;

    animation:
      draw 2s cubic-bezier(0.4, 0, 0.2, 1) infinite,
      fill 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
}

@layer lobe-popup {
  .lobe-context-trigger[data-popup-open],
  .lobe-dropdown-menu-trigger[data-popup-open] {
    background: ${v('colorFillTertiary')};
  }
}

@layer lobe-base {
  :where(.lobe-flex) {
    --lobe-flex: 0 1 auto;
    --lobe-flex-direction: column;
    --lobe-flex-wrap: nowrap;
    --lobe-flex-justify: flex-start;
    --lobe-flex-align: stretch;
    --lobe-flex-width: auto;
    --lobe-flex-height: auto;
    --lobe-flex-padding: 0;
    --lobe-flex-padding-inline: var(--lobe-flex-padding);
    --lobe-flex-padding-block: var(--lobe-flex-padding);
    --lobe-flex-gap: 0;

    display: flex;
    flex: var(--lobe-flex);
    flex-flow: var(--lobe-flex-direction) var(--lobe-flex-wrap);
    gap: var(--lobe-flex-gap);
    align-items: var(--lobe-flex-align);
    justify-content: var(--lobe-flex-justify);

    width: var(--lobe-flex-width);
    height: var(--lobe-flex-height);
    padding: var(--lobe-flex-padding);
    padding-block: var(--lobe-flex-padding-block);
    padding-inline: var(--lobe-flex-padding-inline);
  }

  .lobe-flex-hidden {
    display: none;
  }
}

@keyframes draw {
  0% {
    stroke-dashoffset: 1000;
  }

  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes fill {
  30% {
    fill-opacity: 0.05;
  }

  100% {
    fill-opacity: 1;
  }
}`;

let cached: string | undefined;

export const getThemeCss = () =>
  (cached ??= [
    appearanceRule(":root, [data-theme='light']", 'light'),
    appearanceRule("[data-theme='dark']", 'dark'),
    ...colorRules('light'),
    ...colorRules('dark'),
    globalCss,
  ].join('\n\n'));
