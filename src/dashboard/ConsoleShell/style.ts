import { createStaticStyles } from '@/styles';

const SIDEBAR_INLINE_SIZE = 248;
// Twice the nav icon inset (8px nav padding + 10px item padding) plus the 18px icon, so the icons
// land centered on the rail without moving sideways.
const SIDEBAR_RAIL_INLINE_SIZE = 54;
const WORKSPACE_INSET = 8;

/**
 * `responsive.laptop`, not `responsive.tablet`. The aliases are named for
 * devices, and only `laptop` (max-width 991px) lines up with `useIsCompact`.
 */
export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  brand: css`
    display: flex;
    flex: none;
    align-items: center;

    block-size: 56px;
    margin-block-start: ${WORKSPACE_INSET}px;
    padding-inline: 15px;

    color: ${cssVar.colorText};
    white-space: nowrap;

    ${responsive.laptop} {
      margin-block-start: 0;
    }
  `,
  brandAnchor: css`
    display: flex;
    align-items: center;

    inline-size: 100%;
    min-inline-size: 0;

    color: inherit;
    text-decoration: none;
  `,
  brandLockup: css`
    display: flex;
    gap: 10px;
    align-items: center;
    min-inline-size: 0;
  `,
  brandName: css`
    overflow: hidden;

    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
    color: ${cssVar.colorText};
    text-overflow: ellipsis;
    white-space: nowrap;

    transition: opacity 120ms ease 80ms;

    [data-collapsed='true'] & {
      text-overflow: clip;
      opacity: 0;
      transition-delay: 0s;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  `,
  main: css`
    overflow: auto;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 20px;

    min-inline-size: 0;
    min-block-size: 0;
    padding: 24px;

    /*
     * A page that owns a full-height split sets data-page-layout="flush" and
     * takes over padding and scrolling, so its sidebar can sit on the card edge.
     */
    &:has([data-page-layout='flush']) {
      overflow: hidden;
      gap: 0;
      padding: 0;
    }

    ${responsive.mobile} {
      gap: 16px;
      padding: 16px;
    }
  `,
  navSlot: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    min-block-size: 0;
  `,
  shell: css`
    overflow: hidden;
    display: flex;
    flex: 1;

    block-size: 100%;
    min-block-size: 0;

    background: ${cssVar.colorBgLayout};
  `,
  sidebar: css`
    overflow: hidden;
    display: flex;
    flex: none;
    flex-direction: column;

    inline-size: ${SIDEBAR_INLINE_SIZE}px;
    block-size: 100%;
    min-block-size: 0;

    transition: inline-size 200ms ease;

    &[data-collapsed='true'] {
      inline-size: ${SIDEBAR_RAIL_INLINE_SIZE}px;
    }

    &[data-instant='true'] {
      transition: none;
    }

    ${responsive.laptop} {
      display: none;
    }
  `,
  sidebarBottom: css`
    flex: none;
    padding: 8px;
  `,
  skipLink: css`
    position: fixed;
    z-index: 2000;
    inset-block-start: -100px;
    inset-inline-start: 12px;

    padding-block: 8px;
    padding-inline: 12px;
    border-radius: ${cssVar.borderRadius};

    color: ${cssVar.colorText};

    background: ${cssVar.colorBgElevated};

    &:focus {
      inset-block-start: 12px;
    }
  `,
  topbar: css`
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;

    block-size: 56px;
    padding-inline: 12px;
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
  `,
  topbarDivider: css`
    flex: none;

    inline-size: 1px;
    block-size: 18px;
    margin-inline: 2px;

    background: ${cssVar.colorBorderSecondary};
  `,
  topbarMain: css`
    display: flex;
    flex: 1;
    align-items: center;
    min-inline-size: 0;
  `,
  tools: css`
    display: flex;
    flex: none;
    gap: 6px;
    align-items: center;

    margin-inline-start: auto;
  `,
  workspace: css`
    overflow: hidden;
    display: flex;
    flex: 1;
    flex-direction: column;

    min-inline-size: 0;
    min-block-size: 0;
    margin-block: ${WORKSPACE_INSET}px;
    margin-inline: 0 ${WORKSPACE_INSET}px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};

    background: ${cssVar.colorBgContainer};
    box-shadow: ${cssVar.boxShadowTertiary};

    ${responsive.laptop} {
      margin: 0;
      border: none;
      border-radius: 0;
      box-shadow: none;
    }
  `,
}));
