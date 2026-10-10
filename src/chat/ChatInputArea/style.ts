import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const textareaClassName = 'lobe-chat-input-area-textarea';

export const styles = stylex.create({
  container: {
    gap: 8,
    paddingInline: 0,
    display: 'flex',
    flexDirection: 'column',
    paddingBlockEnd: '12px',
    paddingBlockStart: '8px',
    position: 'relative',
    height: '100%',
  },
  fullscreen: {
    insetInline: 0,
    backgroundColor: cssVar.colorBgContainer,
    insetBlockEnd: 0,
    position: 'absolute',
    zIndex: 10,
  },
  textareaContainer: {
    flex: '1',
    position: 'relative',
  },
});

export const actionBarStyles = stylex.create({
  left: {
    'overflowX': 'auto',
    'overflowY': 'hidden',
    '::-webkit-scrollbar': {
      backgroundColor: 'transparent',
      display: 'none',
      height: 0,
      width: 0,
    },
  },
  root: {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
});
