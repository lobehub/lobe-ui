import { createStaticStyles } from 'antd-style';

const transitionDuration = '0.3s';
const transitionEasing = 'cubic-bezier(0.32, 0.72, 0, 1)';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  root: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: ${cssVar.colorBgContainer};
  `,
  overlayRadius: css`
    border-radius: 12px 12px 0 0;
  `,
  inlineRadius: css`
    border-radius: 12px;
  `,
  elevated: css`
    box-shadow: ${cssVar.boxShadowSecondary};
  `,
  embedded: css`
    border: 1px solid ${cssVar.colorBorderSecondary};
    box-shadow: none;
  `,
  overlay: css`
    position: absolute;
    z-index: 10;
    inset-block-end: 0;
    inset-inline: 0;
  `,
  inline: css`
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  `,
  transition: css`
    transition:
      height ${transitionDuration} ${transitionEasing},
      margin-block-start ${transitionDuration} ${transitionEasing};
  `,
  hidden: css`
    visibility: hidden;
  `,
  header: css`
    cursor: grab;
    user-select: none;

    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    align-items: center;

    padding-block: 8px 4px;
    padding-inline: 16px;
  `,
  headerDragging: css`
    cursor: grabbing;
  `,
  handle: css`
    width: 32px;
    height: 4px;
    margin-block-end: 8px;
    border-radius: 2px;

    background: ${cssVar.colorBorderSecondary};
  `,
  headerContent: css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    min-height: 24px;
  `,
  headerTitle: css`
    flex: 1;
    min-width: 0;
  `,
  headerActions: css`
    display: flex;
    flex-shrink: 0;
    gap: 4px;
    align-items: center;
  `,
  content: css`
    overflow: auto;
    flex: 1;
    min-height: 0;
  `,
}));
