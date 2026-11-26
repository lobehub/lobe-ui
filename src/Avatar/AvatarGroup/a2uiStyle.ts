import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit a2ui-playground (MIT): renderers/data.tsx `AvatarGroup`, renderers.css tint.
export const styles = stylex.create({
  avatar: {
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    // The playground's ring takes the text colour (ink) on avatars.
    boxShadow: `0 0 0 2px ${a2ui.fg}`,
    color: a2ui.avatarTintFg,
    fontSize: 11,
    fontWeight: 500,
    lineHeight: 1.5,
    backgroundColor: a2ui.avatarTintBg,
    transform: { 'default': null, ':hover': 'translateY(-2px)' },
    transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: { 'default': null, ':hover': 10 },
  },
  count: {
    borderRadius: 999,
    position: 'relative',
    flexShrink: 0,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    boxShadow: `0 0 0 2px ${a2ui.surface}`,
    color: a2ui.fgMuted,
    fontSize: 11,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    lineHeight: 1.5,
    backgroundColor: a2ui.muted,
  },
  img: {
    objectFit: 'cover',
    height: '100%',
    width: '100%',
  },
  label: {
    overflow: 'hidden',
    minWidth: 0,
    color: a2ui.fgMuted,
    fontSize: 12.5,
    lineHeight: 1.5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  root: {
    gap: 12,
    alignItems: 'center',
    display: 'flex',
    minWidth: 0,
  },
  stack: {
    flexShrink: 0,
    display: 'flex',
  },
});
