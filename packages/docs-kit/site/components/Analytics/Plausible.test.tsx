import { render } from '@testing-library/react';

import { siteMetadata } from '../../content/siteMetadata';
import { Plausible } from './Plausible';

it('emits the exact production-only deferred script attributes', () => {
  const { container } = render(<Plausible enabled />);
  const script = container.querySelector('script');

  expect(script?.getAttribute('data-domain')).toBe(siteMetadata.plausible.domain);
  expect(script?.getAttribute('src')).toBe(siteMetadata.plausible.source);
  expect(script?.defer).toBe(true);
  expect(script?.hasAttribute('async')).toBe(false);
});

it('is absent outside production', () => {
  const { container } = render(<Plausible />);
  expect(container.querySelector('script')).toBeNull();
});
