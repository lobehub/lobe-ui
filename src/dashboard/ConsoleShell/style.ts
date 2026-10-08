import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

import { consoleBrandMarker } from './marker.stylex';

const SIDEBAR_INLINE_SIZE = 248;
// Twice the nav icon inset (8px nav padding + 10px item padding) plus the 18px icon, so the icons
// land centered on the rail without moving sideways.
const SIDEBAR_RAIL_INLINE_SIZE = 54;
const WORKSPACE_INSET = 8;

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const flushPage = ':has([data-page-layout="flush"])';

/**
 * `media.laptop`, not `media.tablet`. The aliases are named for
 * devices, and only `laptop` (max-width 991px) lines up with `useIsCompact`.
 */
export const styles = stylex.create({
  brand: {
    flex: 'none',
    paddingInline: 15,
    alignItems: 'center',
    blockSize: 56,
    color: cssVar.colorText,
    display: 'flex',
    marginBlockStart: { default: WORKSPACE_INSET, [media.laptop]: 0 },
    whiteSpace: 'nowrap',
  },
  brandAnchor: {
    textDecoration: 'none',
    alignItems: 'center',
    color: 'inherit',
    display: 'flex',
    inlineSize: '100%',
    minInlineSize: 0,
  },
  brandLockup: {
    gap: 10,
    alignItems: 'center',
    display: 'flex',
    minInlineSize: 0,
  },
  brandName: {
    overflow: 'hidden',
    transition: { default: 'opacity 120ms ease 80ms', [reducedMotion]: 'none' },
    color: cssVar.colorText,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.3,
    opacity: {
      default: null,
      [stylex.when.ancestor('[data-collapsed="true"]', consoleBrandMarker)]: 0,
    },
    textOverflow: {
      default: 'ellipsis',
      [stylex.when.ancestor('[data-collapsed="true"]', consoleBrandMarker)]: 'clip',
    },
    transitionDelay: {
      default: null,
      [stylex.when.ancestor('[data-collapsed="true"]', consoleBrandMarker)]: '0s',
    },
    whiteSpace: 'nowrap',
  },
  main: {
    padding: {
      default: 24,
      [flushPage]: 0,
      [media.mobile]: { default: 16, [flushPage]: 0 },
    },
    flex: '1',
    gap: {
      default: 20,
      [flushPage]: 0,
      [media.mobile]: { default: 16, [flushPage]: 0 },
    },
    overflow: { default: 'auto', [flushPage]: 'hidden' },
    display: 'flex',
    flexDirection: 'column',
    minBlockSize: 0,
    minInlineSize: 0,
  },
  navSlot: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    minBlockSize: 0,
  },
  shell: {
    flex: '1',
    overflow: 'hidden',
    backgroundColor: cssVar.colorBgLayout,
    blockSize: '100%',
    display: 'flex',
    minBlockSize: 0,
  },
  sidebar: {
    flex: 'none',
    overflow: 'hidden',
    transition: 'inline-size 200ms ease',
    blockSize: '100%',
    display: { default: 'flex', [media.laptop]: 'none' },
    flexDirection: 'column',
    inlineSize: SIDEBAR_INLINE_SIZE,
    minBlockSize: 0,
  },
  sidebarCollapsed: {
    inlineSize: SIDEBAR_RAIL_INLINE_SIZE,
  },
  sidebarInstant: {
    transition: 'none',
  },
  sidebarBottom: {
    padding: 8,
    flex: 'none',
  },
  skipLink: {
    borderRadius: cssVar.borderRadius,
    paddingBlock: 8,
    paddingInline: 12,
    backgroundColor: cssVar.colorBgElevated,
    color: cssVar.colorText,
    insetBlockStart: { 'default': -100, ':focus': 12 },
    insetInlineStart: 12,
    position: 'fixed',
    zIndex: 2000,
  },
  topbar: {
    flex: 'none',
    gap: 8,
    paddingInline: 12,
    alignItems: 'center',
    blockSize: 56,
    borderBlockEndColor: cssVar.colorBorderSecondary,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    display: 'flex',
  },
  topbarDivider: {
    flex: 'none',
    marginInline: 2,
    backgroundColor: cssVar.colorBorderSecondary,
    blockSize: 18,
    inlineSize: 1,
  },
  topbarMain: {
    flex: '1',
    alignItems: 'center',
    display: 'flex',
    minInlineSize: 0,
  },
  tools: {
    flex: 'none',
    gap: 6,
    alignItems: 'center',
    display: 'flex',
    marginInlineStart: 'auto',
  },
  workspace: {
    borderColor: { default: cssVar.colorBorderSecondary, [media.laptop]: 'currentcolor' },
    borderRadius: { default: cssVar.borderRadiusLG, [media.laptop]: 0 },
    borderStyle: { default: 'solid', [media.laptop]: 'none' },
    borderWidth: { default: 1, [media.laptop]: 'medium' },
    flex: '1',
    marginBlock: { default: WORKSPACE_INSET, [media.laptop]: 0 },
    marginInline: { default: `0 ${WORKSPACE_INSET}px`, [media.laptop]: 0 },
    overflow: 'hidden',
    backgroundColor: cssVar.colorBgContainer,
    boxShadow: { default: cssVar.boxShadowTertiary, [media.laptop]: 'none' },
    display: 'flex',
    flexDirection: 'column',
    minBlockSize: 0,
    minInlineSize: 0,
  },
});
