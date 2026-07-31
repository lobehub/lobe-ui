import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  backdrop: css`
    position: fixed;
    z-index: 1200;
    inset: 0;

    background: ${cssVar.colorBgMask};

    transition: opacity 180ms cubic-bezier(0.32, 0.72, 0, 1);

    &[data-starting-style],
    &[data-ending-style] {
      opacity: 0;
    }
  `,

  popup: css`
    pointer-events: none;

    position: fixed;
    z-index: 1201;

    display: flex;

    /* clamp here rather than on the panel, so an oversized size prop shrinks the
       box instead of detaching the panel from its anchored edge */
    max-width: 100dvw;
    max-height: 100dvh;
  `,

  popupLeft: css`
    inset-block: 0;
    inset-inline-start: 0;
  `,

  popupRight: css`
    inset-block: 0;
    inset-inline-end: 0;
  `,

  popupTop: css`
    inset-block-start: 0;
    inset-inline: 0;
  `,

  popupBottom: css`
    inset-block-end: 0;
    inset-inline: 0;
  `,

  panel: css`
    pointer-events: auto;

    position: relative;

    /* push offset rides on CSS vars so [data-starting-style] can override the whole transform */
    transform: translate(var(--drawer-push-x, 0), var(--drawer-push-y, 0));

    overflow: hidden;
    display: flex;
    flex: 1;
    flex-direction: column;

    box-sizing: border-box;
    min-width: 0;
    min-height: 0;

    /* Elevated, not container: in dark themes container sits within 2 points of the page
       background, so a panel with no border and a black-on-black cast loses its edge entirely. */
    background: ${cssVar.colorBgElevated};

    /* An edge-anchored panel casts along its placement axis, not downward like a centred
       dialog would. Direction classes set the sign, weight classes set the opacity, so the
       two compose without a class per combination. */
    box-shadow:
      calc(var(--drawer-cast-x, 0) * 6px) calc(var(--drawer-cast-y, 0) * 6px) 24px 0
        rgb(0 0 0 / var(--drawer-cast-far, 8%)),
      calc(var(--drawer-cast-x, 0) * 2px) calc(var(--drawer-cast-y, 0) * 2px) 6px 0
        rgb(0 0 0 / var(--drawer-cast-near, 4%));

    transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
  `,

  panelLeft: css`
    --drawer-cast-x: 1;

    &[data-starting-style],
    &[data-ending-style] {
      transform: translateX(-100%);
    }
  `,

  panelRight: css`
    --drawer-cast-x: -1;

    &[data-starting-style],
    &[data-ending-style] {
      transform: translateX(100%);
    }
  `,

  panelTop: css`
    --drawer-cast-y: 1;

    &[data-starting-style],
    &[data-ending-style] {
      transform: translateY(-100%);
    }
  `,

  panelBottom: css`
    --drawer-cast-y: -1;

    &[data-starting-style],
    &[data-ending-style] {
      transform: translateY(100%);
    }
  `,

  /* Only the edges facing content get rounded; the anchored edge stays flush with the viewport.
     Kept apart from the direction classes so a flush panel can drop the radius by omitting the
     class rather than by out-specifying it. */
  panelRoundedLeft: css`
    border-start-end-radius: 12px;
    border-end-end-radius: 12px;
  `,

  panelRoundedRight: css`
    border-start-start-radius: 12px;
    border-end-start-radius: 12px;
  `,

  panelRoundedTop: css`
    border-end-start-radius: 12px;
    border-end-end-radius: 12px;
  `,

  panelRoundedBottom: css`
    border-start-start-radius: 12px;
    border-start-end-radius: 12px;
  `,

  /* Filling the viewport leaves nothing to cast onto — the shadow would only dirty the edge. */
  panelFlush: css`
    --drawer-cast-far: 0%;
    --drawer-cast-near: 0%;
  `,

  /* Without a backdrop the panel has to earn its separation from live content behind it. */
  panelBoosted: css`
    --drawer-cast-far: 14%;
    --drawer-cast-near: 7%;
  `,

  /* A pushed ancestor has receded behind its child; stacking full-weight casts would silt up. */
  panelRecessed: css`
    --drawer-cast-far: 4%;
    --drawer-cast-near: 2%;
  `,

  header: css`
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;
    justify-content: space-between;

    min-height: 56px;
    padding-block: 12px;
    padding-inline: 16px;
    border-block-end: 1px solid ${cssVar.colorSplit};
  `,

  containerInner: css`
    display: flex;
    flex: 1;
    gap: 8px;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    margin-inline: auto;
  `,

  containerInnerFooter: css`
    justify-content: flex-end;
  `,

  title: css`
    margin: 0;

    font-size: 17px;
    font-weight: 600;
    line-height: 1.4;
    color: ${cssVar.colorText};
    letter-spacing: -0.005em;
  `,

  extra: css`
    display: flex;
    flex: none;
    gap: 4px;
    align-items: center;

    margin-inline-end: -4px;
  `,

  extraFloating: css`
    position: absolute;
    z-index: 1;
    inset-block-start: 12px;
    inset-inline-end: 12px;

    margin-inline-end: 0;
  `,

  close: css`
    cursor: pointer;

    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 8px;

    color: ${cssVar.colorTextTertiary};

    background: transparent;

    transition:
      color 160ms cubic-bezier(0.32, 0.72, 0, 1),
      background 160ms cubic-bezier(0.32, 0.72, 0, 1),
      transform 160ms cubic-bezier(0.32, 0.72, 0, 1);

    /* Restores the 40px target the 32px visual box gives up, without nudging the header layout. */
    &::after {
      content: '';
      position: absolute;
      inset: -4px;
    }

    &:hover {
      transform: scale(1.04);
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:active {
      transform: scale(0.96);
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBorder};
    }
  `,

  content: css`
    overflow: hidden auto;
    display: flex;
    flex: 1;
    min-height: 0;
  `,

  bodyContent: css`
    display: flex;
    flex-direction: column;

    width: 100%;
    min-height: 100%;
    margin-inline: auto;
    padding-block: 12px;
    padding-inline: 16px;
  `,

  contentSidebar: css`
    overflow: hidden;
  `,

  bodyContentSidebar: css`
    flex-direction: row;
    height: 100%;
    min-height: 0;
    padding: 0;
  `,

  sidebar: css`
    overflow: hidden auto;
    flex: none;

    padding-block: 12px;
    padding-inline: 16px;
    border-inline-end: 1px solid ${cssVar.colorSplit};

    /* A translucent fill reads as a secondary surface against whatever the panel is, where the
       page-level layout colour would punch a hole through an elevated panel in dark themes. */
    background: ${cssVar.colorFillTertiary};
  `,

  sidebarContent: css`
    overflow: hidden auto;
    flex: 1;

    min-width: 0;
    padding-block: 12px;
    padding-inline: 16px;
  `,

  footer: css`
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;

    padding-block: 12px;
    padding-inline: 16px;
    border-block-start: 1px solid ${cssVar.colorSplit};
  `,
}));
