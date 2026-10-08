import * as stylex from '@stylexjs/stylex';

import { landingTokens } from '@/awesome/landingTokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

const splitStack = '@media (max-width: 860px)';

export const styles = stylex.create({
  accent: {
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    backgroundImage: landingTokens.accentGradient,
  },
  actions: {
    justifyContent: 'center',
    marginBlockStart: 36,
  },
  actionsSplit: {
    justifyContent: 'flex-start',
  },
  aside: {
    display: 'flex',
    justifyContent: 'center',
    minInlineSize: 0,
  },
  badge: {
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 6,
    paddingBlock: 4,
    paddingInline: 12,
    alignItems: 'center',
    backdropFilter: 'blur(8px)',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgContainer} 70%, transparent)`,
    color: cssVar.colorTextSecondary,
    display: 'inline-flex',
    fontSize: cssVar.fontSizeSM,
    marginBlockEnd: 24,
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
    position: 'relative',
    zIndex: 1,
  },
  description: {
    marginInline: 0,
    color: cssVar.colorTextSecondary,
    fontSize: 'clamp(16px, 2vw, 19px)',
    lineHeight: 1.6,
    marginBlockEnd: 0,
    marginBlockStart: 20,
    maxInlineSize: '36rem',
    textWrap: 'balance',
  },
  extra: {
    gap: 40,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
    marginBlockStart: 48,
  },
  intro: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  introSplit: {
    alignItems: { default: 'flex-start', [splitStack]: 'center' },
    textAlign: { default: 'start', [splitStack]: 'center' },
  },
  main: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
  },
  mainSplit: {
    gap: { default: 'clamp(32px, 5vw, 64px)', [splitStack]: 48 },
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1.1fr) minmax(0, 1fr)',
      [splitStack]: 'minmax(0, 1fr)',
    },
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    paddingBlockEnd: 'clamp(40px, 7vh, 72px)',
    paddingBlockStart: 'clamp(72px, 13vh, 128px)',
    position: 'relative',
    textAlign: 'center',
  },
  rootSplit: {
    paddingBlockStart: 'clamp(56px, 10vh, 104px)',
  },
  title: {
    margin: 0,
    color: cssVar.colorText,
    fontSize: 'clamp(44px, 8vw, 84px)',
    fontWeight: 900,
    letterSpacing: '-0.045em',
    lineHeight: 1.02,
    textWrap: 'balance',
  },
  titleSplit: {
    fontSize: 'clamp(44px, 6vw, 72px)',
  },
});
