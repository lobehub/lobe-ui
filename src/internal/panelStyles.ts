import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { focusRing } from '@/styles/stylex/focusRing';

const styles = stylex.create({
  label: {
    color: cssVar.colorTextTertiary,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  nav: {
    alignItems: 'center',
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillTertiary },
    backgroundImage: 'none',
    borderRadius: '50%',
    borderStyle: 'none',
    borderWidth: 0,
    color: { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    cursor: 'pointer',
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    padding: 0,
    width: 28,
  },
  popup: {
    backgroundColor: cssVar.colorBgElevated,
    borderRadius: 16,
    boxShadow: `${cssVar.boxShadow}, var(--lobe-ring)`,
    padding: 16,
  },
  title: {
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderStyle: 'none',
    borderWidth: 0,
    color: cssVar.colorText,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
    padding: 0,
    textAlign: 'start',
  },
  titleMuted: {
    color: cssVar.colorTextTertiary,
    fontWeight: 400,
  },
});

export const panelStyles = {
  label: styles.label,
  nav: [focusRing.info, styles.nav],
  popup: styles.popup,
  title: [focusRing.info, styles.title],
  titleMuted: styles.titleMuted,
};
