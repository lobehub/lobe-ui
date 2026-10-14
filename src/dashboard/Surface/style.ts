import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { surfaceMarker } from './marker.stylex';

/**
 * A content card sitting on the workspace.
 *
 * Backgrounds: light mode uses `colorBgContainer`. Dark mode uses the translucent
 * `colorFillQuaternary` (white 2%), one step below `colorFillTertiary`, for a quieter raised
 * step on the workspace.
 *
 * Borders and inner dividers (table, header and cell lines, PageSkeleton, strip seams) use
 * `--lobe-fill-border` (`colorFill` in light, `colorFillSecondary` in dark; from theme.css).
 * Hover / focus / stronger edges use `--lobe-fill-border-strong` (light: `colorFill` mixed 15%
 * toward `colorText`; dark: `colorFill`).
 *
 * Anything that must hide content scrolled beneath it (table header cells, pinned and sticky
 * cells) uses `--lobe-surface-bg-solid`: the same white 2% blended onto `--lobe-surface-canvas`
 * (default `colorBgContainer`, the ConsoleShell workspace). `color-mix` in srgb with an opaque
 * base is plain alpha compositing, so it matches the translucent card. Set
 * `--lobe-surface-canvas` when a card sits on another page color.
 *
 * A Surface inside another Surface (`useSurfaceDepth() > 0`) drops its own fill so fills do not
 * stack. Row hover backgrounds keep their own mix. Layout containers (ConsoleShell, ConsoleNav,
 * FilterSidebar split divider, AuthLayout page canvas) keep their own tokens.
 *
 * Apply the card with `useSurfaceCardStyles()` / `useSurfaceCardClassName()`; plain
 * `surfaceStyles.card` is the light look. Table rules for consumer markup live in `style.css`.
 */
export const styles = stylex.create({
  arrow: {
    flex: 'none',
    transition: 'color 150ms ease-out, transform 150ms ease-out',
    color: {
      default: cssVar.colorTextTertiary,
      [stylex.when.ancestor(':hover', surfaceMarker)]: cssVar.colorText,
    },
    marginBlockStart: 8,
    marginInlineStart: 'auto',
    transform: {
      default: null,
      [stylex.when.ancestor(':hover', surfaceMarker)]: 'translate(1px, -1px)',
    },
  },
  arrowInLink: {
    marginBlockStart: 0,
  },
  arrowLink: {
    flex: 'none',
    alignItems: 'center',
    color: 'inherit',
    display: 'flex',
  },
  body: {
    '--surface-pad-block': '16px',
    '--surface-pad-inline': '16px',
    'padding': 16,
  },
  card: {
    '--lobe-surface-bg': cssVar.colorBgContainer,
    '--lobe-surface-bg-solid': cssVar.colorBgContainer,
    'borderColor': `var(--lobe-fill-border, ${cssVar.colorFill})`,
    'borderRadius': cssVar.borderRadiusLG,
    'borderStyle': 'solid',
    'borderWidth': 1,
    'backgroundColor': 'var(--lobe-surface-bg)',
    'boxShadow': 'rgb(0 0 0 / 4%) 0 1px 2px 0',
  },
  cardDark: {
    '--lobe-surface-bg': cssVar.colorFillQuaternary,
    '--lobe-surface-bg-solid': `color-mix(in srgb, #fff 2%, var(--lobe-surface-canvas, ${cssVar.colorBgContainer}))`,
  },
  cardLinked: {
    borderColor: {
      'default': `var(--lobe-fill-border, ${cssVar.colorFill})`,
      ':focus-within': `var(--lobe-fill-border-strong, ${cssVar.colorFill})`,
      ':hover': `var(--lobe-fill-border-strong, ${cssVar.colorFill})`,
    },
  },
  cardNested: {
    backgroundColor: 'transparent',
  },
  chart: {
    minInlineSize: 0,
  },
  clip: {
    overflow: 'clip',
  },
  content: {
    minInlineSize: 0,
  },
  desc: {
    color: cssVar.colorTextSecondary,
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.45,
    marginBlockStart: -4,
  },
  /* One fixed control row (32px, the height of a small Segmented or a default ActionIcon), so a
     header with controls is exactly as tall as one without, and the controls sit centered with
     8px clear above the divider. */
  extra: {
    flex: 'none',
    gap: 8,
    alignItems: 'center',
    blockSize: 32,
    display: 'flex',
  },
  header: {
    gap: 12,
    paddingBlock: 8,
    paddingInline: 16,
    alignItems: 'flex-start',
    borderBlockEndColor: `var(--lobe-fill-border, ${cssVar.colorFill})`,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
    minBlockSize: 48,
  },
  heading: {
    minInlineSize: 0,
  },
  headingLink: {
    flex: '1',
    gap: 12,
    textDecoration: 'none',
    alignItems: 'flex-start',
    color: { 'default': 'inherit', ':hover': 'inherit' },
    display: 'flex',
    minInlineSize: 0,
  },
  loading: {
    paddingBlockEnd: 8,
    paddingBlockStart: 4,
  },
  title: {
    overflow: 'hidden',
    color: cssVar.colorText,
    fontSize: 14,
    fontWeight: 500,
    /* The title line is the 32px control row; extra and the arrow center on it, and a
       description adds its own line below without moving them. */
    lineHeight: '32px',
    minInlineSize: 0,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export const surfaceClassNames = {
  bleed: 'lobe-surface-bleed',
  root: 'lobe-surface',
  tableBleed: 'lobe-surface-table-bleed',
};

export const surfaceStyles = {
  card: stylex.props(styles.card).className ?? '',
  clip: stylex.props(styles.clip).className ?? '',
  tableBleed: surfaceClassNames.tableBleed,
};
