import { createStaticStyles } from 'antd-style';

const TRANSITION_DURATION = '0.3s';
const TRANSITION_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  root: css`
    border-radius: 12px 12px 0 0;
    background: ${cssVar.colorBgContainer};
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
  `,
  push: css`
    flex-shrink: 0;
  `,
  transition: css`
    transition: height ${TRANSITION_DURATION} ${TRANSITION_EASING};
  `,
  hidden: css`
    visibility: hidden;
  `,
  header: css`
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 16px 4px;
    cursor: grab;
    user-select: none;
  `,
  headerDragging: css`
    cursor: grabbing;
  `,
  handle: css`
    width: 32px;
    height: 4px;
    border-radius: 2px;
    background: ${cssVar.colorBorderSecondary};
    margin-bottom: 8px;
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
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 4px;
  `,
  content: css`
    flex: 1;
    min-height: 0;
    overflow: auto;
  `,
}));
