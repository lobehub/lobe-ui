import * as stylex from '@stylexjs/stylex';

export const tiers = stylex.defineConsts({
  finePointer: '@media (hover: hover) and (pointer: fine)',
  mid: '@container docs (min-width: 48rem) and (max-width: 63.99rem)',
  narrow: '@container docs (max-width: 47.99rem)',
  wide: '@container docs (min-width: 64rem)',
});
