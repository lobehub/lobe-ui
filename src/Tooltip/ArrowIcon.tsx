'use client';

import * as stylex from '@stylexjs/stylex';

import { styles } from './style';

export const TooltipArrowIcon = (
  <svg
    aria-hidden="true"
    height="6"
    viewBox="0 0 12 6"
    width="12"
    {...stylex.props(styles.arrowSvg)}
  >
    <path d="M0 6L6 0L12 6Z" data-role="fill" />
    <path d="M0 6L6 0L12 6" data-role="stroke" {...stylex.props(styles.arrowStroke)} />
  </svg>
);
