import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  actionsBottom: {
    alignSelf: 'flex-end',
  },
  actionsTop: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    flex: 'none',
    position: 'relative',
    height: 'var(--chat-item-avatar-size, 40px)',
    width: 'var(--chat-item-avatar-size, 40px)',
  },
  container: {
    paddingInline: { default: 12, [media.sm]: 8 },
    paddingBlockEnd: 12,
    paddingBlockStart: { default: 24, [media.sm]: 12 },
    position: 'relative',
    maxWidth: '100vw',
  },
  containerDocs: {
    transition: `background-color 100ms ${cssVar.motionEaseOut}`,
    marginBlockEnd: -16,
    paddingBlockStart: { default: 24, [media.sm]: 16 },
  },
  editingInput: {
    width: '100%',
  },
  editingContainer: {
    borderColor: {
      'default': cssVar.colorBorderSecondary,
      ':hover': cssVar.colorBorder,
      ':active': cssVar.colorBorder,
    },
    borderStyle: 'solid',
    borderWidth: 1,
  },
  editingContainerDocs: {
    borderRadius: cssVar.borderRadius,
    backgroundColor: cssVar.colorFillQuaternary,
  },
  errorContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  loading: {
    borderRadius: '50%',
    backgroundColor: cssVar.colorPrimary,
    color: cssVar.colorBgLayout,
    insetBlockEnd: 0,
    position: 'absolute',
  },
  loadingLeft: {
    insetInlineStart: -4,
  },
  loadingRight: {
    insetInlineEnd: -4,
  },
  messageContent: {
    flexDirection: { default: null, [media.sm]: 'column' },
  },
  narrowFullWidth: {
    width: { default: null, [media.sm]: '100%' },
  },
  messageBubble: {
    borderColor: `color-mix(in srgb, ${cssVar.colorBorderSecondary} 66%, transparent)`,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorBgContainer,
  },
  messageBox: {
    overflow: 'hidden',
    position: 'relative',
    maxWidth: '100%',
  },
  messageContainer: {
    overflowX: { default: null, [media.sm]: 'auto' },
  },
  name: {
    color: cssVar.colorTextDescription,
    fontSize: 12,
    lineHeight: 1,
    marginBlockEnd: 6,
    pointerEvents: 'none',
  },
  nameLeft: {
    textAlign: 'start',
  },
  nameRight: {
    textAlign: 'end',
  },
  withTime: {
    marginBlockStart: -16,
  },
});
