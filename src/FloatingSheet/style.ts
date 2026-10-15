import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const transitionDuration = '0.3s';
const transitionEasing = 'cubic-bezier(0.32, 0.72, 0, 1)';

export const styles = stylex.create({
  content: {
    flex: '1',
    overflow: 'auto',
    minHeight: 0,
  },
  elevated: {
    boxShadow: `${cssVar.boxShadowSecondary}, var(--lobe-ring)`,
  },
  embedded: {
    borderColor: cssVar.colorBorderSecondary,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
  },
  handle: {
    borderRadius: 2,
    backgroundColor: cssVar.colorBorderSecondary,
    marginBlockEnd: 8,
    height: 4,
    width: 32,
  },
  header: {
    paddingInline: 16,
    alignItems: 'center',
    cursor: 'grab',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    paddingBlockEnd: 4,
    paddingBlockStart: 8,
    userSelect: 'none',
  },
  headerDragging: {
    cursor: 'grabbing',
  },
  headerActions: {
    gap: 4,
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
  },
  headerContent: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: 24,
    width: '100%',
  },
  headerTitle: {
    flex: '1',
    minWidth: 0,
  },
  hidden: {
    visibility: 'hidden',
  },
  inline: {
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
  },
  inlineRadius: {
    borderRadius: 12,
  },
  overlay: {
    insetInline: 0,
    insetBlockEnd: 0,
    position: 'absolute',
    zIndex: 10,
  },
  overlayRadius: {
    borderEndEndRadius: 0,
    borderEndStartRadius: 0,
    borderStartEndRadius: 12,
    borderStartStartRadius: 12,
  },
  root: {
    overflow: 'hidden',
    backgroundColor: cssVar.colorBgContainer,
    display: 'flex',
    flexDirection: 'column',
  },
  transition: {
    transition: `height ${transitionDuration} ${transitionEasing}, margin-block-start ${transitionDuration} ${transitionEasing}`,
  },
});
