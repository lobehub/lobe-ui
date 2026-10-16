import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  error: {
    marginInline: 'auto',
    paddingBlock: '5rem',
    width: 'min(100% - 2rem, 44rem)',
  },
  errorText: {
    color: 'var(--docs-text-secondary)',
    lineHeight: 1.7,
  },
  errorTitle: {
    margin: 0,
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    letterSpacing: '-0.05em',
    lineHeight: 1.05,
    textWrap: 'balance',
  },
  page: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    minBlockSize: 0,
    minWidth: 0,
  },
  searchLoading: {
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'fixed',
    whiteSpace: 'nowrap',
    width: 1,
  },
});
