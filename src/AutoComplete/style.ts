import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { menuClassNames, menuStyles } from '@/DropdownMenu/sharedStyle';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

const ownStyles = stylex.create({
  clear: {
    margin: 0,
    padding: 0,
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 'medium',
    outline: 'none',
    transition: `color 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: { 'default': cssVar.colorTextTertiary, ':hover': cssVar.colorText },
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
  },
  empty: {
    backgroundColor: 'transparent',
    cursor: 'default',
    display: { 'default': 'flex', ':empty': 'none' },
  },
  list: {
    display: { 'default': null, ':empty': 'none' },
    maxHeight: 'min(320px, var(--available-height))',
    overflowY: 'auto',
  },
  popup: {
    transition: `opacity 140ms ${cssVar.motionEaseOut}, transform 140ms ${cssVar.motionEaseOut}`,
    opacity: { 'default': null, ':is([data-starting-style], [data-ending-style])': 0 },
    transform: {
      'default': null,
      ':is([data-starting-style], [data-ending-style])': 'scaleY(0.92)',
    },
    transformOrigin: 'var(--transform-origin)',
    minWidth: 0,
    width: 'var(--anchor-width)',
  },
});

const styleArrays = {
  clear: [ownStyles.clear],
  empty: [menuStyles.item, menuStyles.empty, ownStyles.empty],
  item: [menuStyles.item],
  list: [ownStyles.list],
  popup: [menuStyles.popup, ownStyles.popup],
  positioner: [menuStyles.positioner],
};

const stableClassNames: Partial<Record<keyof typeof styleArrays, string>> = {
  popup: menuClassNames.popup,
  positioner: menuClassNames.positioner,
};

export const styles = Object.fromEntries(
  Object.entries(styleArrays).map(([key, value]) => [
    key,
    clsx(stylex.props(value).className, stableClassNames[key as keyof typeof styleArrays]),
  ]),
) as Record<keyof typeof styleArrays, string>;
