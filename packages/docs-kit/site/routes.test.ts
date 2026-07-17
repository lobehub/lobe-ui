import { matchRoutes } from 'react-router';

import routes from './routes';

const matchLeafId = (pathname: string) => matchRoutes(routes as never, pathname)?.at(-1)?.route.id;

it.each(['/changelog', '/components/button', '/editor', '/features/model-icon'])(
  'renders the documentation route for %s',
  (pathname) => {
    expect(matchLeafId(pathname)).toBe('document');
  },
);

it('keeps standalone demos outside the documentation layout', () => {
  expect(matchLeafId('/~demos/button-basic')).toBe('standalone-demo');
});
