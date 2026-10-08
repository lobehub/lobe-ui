import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  aside: {
    position: 'sticky',
    zIndex: 2,
    height: '100%',
  },
  asideInner: {
    height: 'calc(100dvh - var(--layout-header-height, 64px))',
    overflowX: 'hidden',
    overflowY: 'auto',
    width: '100%',
  },
  content: {
    flexBasis: '0%',
    flexGrow: 1,
    flexShrink: 1,
    position: 'relative',
    maxWidth: '100%',
  },
  footer: {
    position: 'relative',
    maxWidth: '100%',
  },
  header: {
    backdropFilter: 'saturate(150%) blur(10px)',
    insetBlockStart: 0,
    position: 'sticky',
    zIndex: 999,
    maxWidth: '100%',
  },
  main: {
    alignItems: 'stretch',
    display: 'flex',
    position: 'relative',
    maxWidth: '100vw',
  },
});
