import './style.css';

import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  wrapper: {
    marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * 0.5em)',
    display: 'block',
    position: 'relative',
    maxWidth: '100%',
    width: 'max-content',
  },
});
