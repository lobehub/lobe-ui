import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  actions: {
    flex: 'none',
  },
  actionsBottom: {
    alignSelf: 'flex-end',
  },
  actionsEnd: {
    justifyContent: 'flex-end',
  },
  actionsStart: {
    justifyContent: 'flex-start',
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
  avatarGroupContainer: {
    width: 'var(--chat-item-avatar-size, 40px)',
  },
  container: {
    paddingInline: { default: 12, [media.sm]: 8 },
    paddingBlockEnd: 12,
    paddingBlockStart: { default: 24, [media.sm]: 12 },
    position: 'relative',
    maxWidth: '100vw',
    width: '100%',
  },
  containerDocs: {
    transition: `background-color 100ms ${cssVar.motionEaseOut}`,
    marginBlockEnd: -16,
    paddingBlockStart: { default: 24, [media.sm]: 16 },
  },
  editing: {
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
    paddingInline: 12,
    paddingBlockEnd: '12px',
    paddingBlockStart: '8px',
  },
  editingContainerDocs: {
    borderRadius: cssVar.borderRadius,
    backgroundColor: cssVar.colorFillQuaternary,
  },
  errorContainer: {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  loading: {
    borderRadius: '50%',
    backgroundColor: cssVar.colorPrimary,
    color: cssVar.colorBgLayout,
    insetBlockEnd: 0,
    position: 'absolute',
    height: 16,
    width: 16,
  },
  loadingLeft: {
    insetInlineStart: -4,
  },
  loadingRight: {
    insetInlineEnd: -4,
  },
  messageBubble: {
    borderColor: `color-mix(in srgb, ${cssVar.colorBorderSecondary} 66%, transparent)`,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingBlock: 8,
    paddingInline: 12,
    backgroundColor: cssVar.colorBgContainer,
    width: { default: null, [media.sm]: '100%' },
  },
  messageBox: {
    overflow: 'hidden',
    position: 'relative',
    maxWidth: '100%',
  },
  messageContainer: {
    overflowX: { default: null, [media.sm]: 'auto' },
  },
  messageContent: {
    flexDirection: { default: null, [media.sm]: 'column' },
  },
  messageDocs: {
    paddingBlockStart: 6,
    width: { default: null, [media.sm]: '100%' },
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
