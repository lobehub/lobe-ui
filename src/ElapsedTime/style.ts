import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  // Fixed-width digits keep the label from jittering as it ticks.
  root: {
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
});
