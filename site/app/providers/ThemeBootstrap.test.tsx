import { afterEach, expect, it } from 'vitest';

import { STANDALONE_APPEARANCE_SCRIPT } from './ThemeBootstrap';

afterEach(() => {
  delete document.documentElement.dataset.standaloneAppearance;
  history.replaceState(null, '', '/');
});

it.each(['light', 'dark'] as const)(
  'marks an explicit standalone %s canvas before hydration',
  (appearance) => {
    history.replaceState(
      null,
      '',
      `/~demos/example?routeId=metadata%2Fonly&appearance=${appearance}`,
    );

    new Function(STANDALONE_APPEARANCE_SCRIPT)();

    expect(document.documentElement.dataset.standaloneAppearance).toBe(appearance);
  },
);

it('ignores appearance overrides outside standalone demo routes', () => {
  history.replaceState(null, '', '/components/button?appearance=dark');

  new Function(STANDALONE_APPEARANCE_SCRIPT)();

  expect(document.documentElement.dataset.standaloneAppearance).toBeUndefined();
});
