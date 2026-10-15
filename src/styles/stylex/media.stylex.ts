import * as stylex from '@stylexjs/stylex';

export const media = stylex.defineConsts({
  desktop: '@media (min-width: 1200px)',
  laptop: '@media (max-width: 991.98px)',
  lg: '@media (max-width: 991.98px)',
  md: '@media (max-width: 767.98px)',
  mobile: '@media (max-width: 479.98px)',
  sm: '@media (max-width: 575.98px)',
  tablet: '@media (max-width: 767.98px)',
  xl: '@media (max-width: 1199.98px)',
  xs: '@media (max-width: 479.98px)',
  xxl: '@media (min-width: 1200px)',
});
