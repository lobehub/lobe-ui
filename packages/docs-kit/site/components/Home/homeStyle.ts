import * as stylex from '@stylexjs/stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

const heroEnter = stylex.keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(10px)',
  },
});

const heading = {
  margin: 0,
  textAlign: 'center',
  textWrap: 'balance',
  color: 'var(--docs-text-primary)',
  fontSize: '1.5rem',
  fontWeight: 650,
  letterSpacing: '-0.02em',
} as const;

export const styles = stylex.create({
  button: {
    borderColor: 'transparent',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: '0.5rem',
    paddingBlock: 0,
    paddingInline: '1.5rem',
    textDecoration: 'none',
    transition: 'background-color 140ms ease, filter 140ms ease, transform 90ms ease',
    alignItems: 'center',
    // eslint-disable-next-line @stylexjs/valid-styles -- the rule rejects valid per-layer lists
    backgroundClip: 'padding-box, border-box',
    backgroundImage: {
      'default':
        'linear-gradient(var(--docs-surface-raised), var(--docs-surface-raised)), var(--docs-gradient-spectral)',
      ':hover':
        'linear-gradient(var(--docs-surface-hover), var(--docs-surface-hover)), var(--docs-gradient-spectral)',
    },
    backgroundOrigin: 'border-box',
    color: 'var(--docs-text-primary)',
    display: 'inline-flex',
    fontSize: '0.875rem',
    fontWeight: 600,
    transform: {
      'default': null,
      ':active': 'scale(0.96)',
    },
    minHeight: '2.75rem',
  },
  buttonPrimary: {
    backgroundColor: {
      'default': 'var(--docs-text-primary)',
      ':hover': 'color-mix(in srgb, var(--docs-text-primary) 86%, var(--docs-background))',
    },
    backgroundImage: 'none',
    color: 'var(--docs-background)',
  },
  cta: {
    'paddingBlock': 'clamp(3.5rem,9vh,5.5rem)',
    'alignItems': 'center',
    'borderBlockStartColor': 'var(--docs-border-subtle)',
    'borderBlockStartStyle': 'solid',
    'borderBlockStartWidth': 1,
    'display': 'flex',
    'flexDirection': 'column',
    'position': 'relative',
    '::after': {
      insetInline: '-20%',
      backgroundImage:
        'radial-gradient(50% 80% at 50% 100%, var(--docs-aurora-violet), transparent 70%)',
      content: '""',
      insetBlockEnd: 'calc(-1 * clamp(2rem, 5vh, 4rem))',
      insetBlockStart: 0,
      maskImage: 'linear-gradient(#000 calc(100% - clamp(2rem, 5vh, 4rem)), transparent)',
      pointerEvents: 'none',
      position: 'absolute',
      zIndex: -1,
    },
  },
  ctaFootnote: {
    marginInline: 0,
    color: 'var(--docs-text-subtle)',
    fontSize: '0.8125rem',
    marginBlockEnd: 0,
    marginBlockStart: '1.125rem',
  },
  ctaLink: {
    gap: '0.25rem',
    textDecoration: {
      'default': 'none',
      ':hover': 'underline',
    },
    alignItems: 'center',
    color: 'var(--docs-accent)',
    display: 'inline-flex',
  },
  ctaTitle: {
    ...heading,
    marginBlockEnd: '1.25rem',
  },
  document: {
    display: 'flex',
    flexBasis: '0%',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    minHeight: '100%',
  },
  feature: {
    borderColor: {
      'default': 'var(--docs-border-subtle)',
      ':hover': 'var(--docs-border-strong)',
    },
    borderRadius: '0.875rem',
    borderStyle: 'solid',
    borderWidth: 1,
    paddingInline: '1.25rem',
    transition: 'border-color 140ms ease',
    backgroundColor: 'color-mix(in srgb, var(--docs-surface-raised) 62%, transparent)',
    paddingBlockEnd: '1.375rem',
    paddingBlockStart: '1.25rem',
  },
  featureDescription: {
    margin: 0,
    color: 'var(--docs-text-secondary)',
    fontSize: '0.8438rem',
    lineHeight: 1.65,
    textWrap: 'pretty',
  },
  featureIcon: {
    borderRadius: '0.5625rem',
    alignItems: 'center',
    backgroundColor: 'color-mix(in srgb, var(--docs-accent) 10%, transparent)',
    color: 'var(--docs-accent)',
    display: 'flex',
    justifyContent: 'center',
    height: '1.875rem',
    width: '1.875rem',
  },
  featureTitle: {
    marginInline: 0,
    color: 'var(--docs-text-primary)',
    fontSize: '0.9375rem',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    marginBlockEnd: '0.375rem',
    marginBlockStart: '0.875rem',
  },
  features: {
    paddingBlock: 'clamp(3rem,8vh,5rem)',
    borderBlockStartColor: 'var(--docs-border-subtle)',
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
  },
  featuresGrid: {
    gap: '1rem',
    display: 'grid',
    gridTemplateColumns: {
      'default': 'repeat(3, minmax(0, 1fr))',
      '@media (width <= 47.5rem)': '1fr',
    },
    marginBlockStart: '1.75rem',
  },
  hero: {
    'paddingInline': 0,
    'alignItems': 'center',
    'display': 'flex',
    'flexDirection': 'column',
    'paddingBlockEnd': 'clamp(3rem, 7vh, 4.5rem)',
    'paddingBlockStart': 'clamp(5rem, 14vh, 8.5rem)',
    'position': 'relative',
    'textAlign': 'center',
    '::before': {
      inset: 0,
      backgroundImage:
        'radial-gradient(38% 55% at 22% 8%, var(--docs-aurora-violet), transparent 70%), radial-gradient(30% 50% at 58% 0%, var(--docs-aurora-blue), transparent 70%), radial-gradient(26% 45% at 84% 12%, var(--docs-aurora-pink), transparent 70%)',
      content: '""',
      pointerEvents: 'none',
      position: 'absolute',
      zIndex: -1,
    },
  },
  heroActions: {
    gap: '0.75rem',
    display: 'flex',
    marginBlockStart: '2.5rem',
  },
  heroDescription: {
    marginInline: 0,
    color: 'var(--docs-text-secondary)',
    fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
    lineHeight: 1.6,
    marginBlockEnd: 0,
    marginBlockStart: '1.375rem',
    textWrap: 'balance',
    maxWidth: '34rem',
  },
  heroEnter: {
    animationDuration: '500ms',
    animationFillMode: 'backwards',
    animationName: { default: heroEnter, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  heroEnterSecond: {
    animationDelay: '90ms',
  },
  heroEnterThird: {
    animationDelay: '180ms',
  },
  heroGradient: {
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    backgroundImage: 'var(--docs-gradient-spectral)',
  },
  heroTitle: {
    margin: 0,
    color: 'var(--docs-text-primary)',
    fontSize: 'clamp(3.25rem, 8vw, 5.5rem)',
    fontWeight: 700,
    letterSpacing: '-0.045em',
    lineHeight: 1.02,
    textWrap: 'balance',
  },
  installCode: {
    'color': 'var(--docs-text-primary)',
    'fontSize': '0.8438rem',
    '::before': {
      color: 'var(--docs-accent)',
      content: '"$"',
      marginInlineEnd: '0.5rem',
    },
  },
  installCommand: {
    borderColor: 'var(--docs-border-subtle)',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: '0.5rem',
    paddingBlock: '0.4375rem',
    alignItems: 'center',
    backgroundColor: 'var(--docs-code-background)',
    boxShadow: 'var(--docs-shadow-control)',
    display: 'flex',
    paddingInlineEnd: '0.4375rem',
    paddingInlineStart: '1rem',
  },
  root: {
    marginInline: 'auto',
    display: 'flex',
    flexBasis: '0%',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    width: {
      'default': 'min(100% - 3rem, 64rem)',
      '@media (width <= 47.5rem)': 'min(100% - 2rem, 64rem)',
    },
  },
});
