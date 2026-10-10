import { accentGradient } from './landingTokens';
import { landingTokens } from './landingTokens.stylex';

it('keeps the StyleX accent gradient in sync with the JS token', () => {
  expect(landingTokens.accentGradient).toBe(accentGradient);
});
