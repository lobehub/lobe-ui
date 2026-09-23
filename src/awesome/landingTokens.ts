export type LandingPalette = [string, string, string];

export const LANDING_PALETTE_LIGHT: LandingPalette = ['#7c5cff', '#d6549e', '#f0885f'];
export const LANDING_PALETTE_DARK: LandingPalette = ['#a78bfa', '#ef7fc0', '#f8a878'];

export const landingGradient = ([from, via, to]: LandingPalette) =>
  `linear-gradient(105deg, ${from} 8%, ${via} 55%, ${to} 95%)`;

/** Consumers can override the accent of every landing component with this CSS variable. */
export const LANDING_GRADIENT_VAR = '--lobe-landing-gradient';

export const accentGradient = `var(${LANDING_GRADIENT_VAR}, ${landingGradient(LANDING_PALETTE_LIGHT)})`;
