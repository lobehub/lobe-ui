import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  root: {
    borderRadius: {
      'default': '15%',
      '@supports (mask-image: url("data:image/svg+xml;base64,"))': 0,
    },
    flex: 'none',
    overflow: 'hidden',
    maskImage: 'var(--lobe-group-avatar-mask)',
    maskPosition: 'center',
    maskRepeat: 'no-repeat',
    maskSize: '100% 100%',
  },
});
