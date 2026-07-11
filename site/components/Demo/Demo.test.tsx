import { renderToString } from 'react-dom/server';

import type { DemoModule } from '../../types/demo';
import Demo from './Demo';

const descriptor: DemoModule = {
  editable: true,
  id: 'height-zero',
  legacyIds: [],
  load: async () => () => null,
  loadScope: async () => ({}),
  routeId: 'components/HeightZero/index',
  source: 'export default () => null;',
  sourcePath: 'src/HeightZero/demos/index.tsx',
};

it('preserves an explicit zero preview height', () => {
  const html = renderToString(<Demo height={0} of={descriptor} />);

  expect(html).toContain('--demo-frame-height:0px');
});
