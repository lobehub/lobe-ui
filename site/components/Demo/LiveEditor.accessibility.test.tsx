import { cleanup, render, screen, waitFor } from '@testing-library/react';

import type { DemoModule } from '../../types/demo';
import LiveEditor from './LiveEditor';

const descriptor: DemoModule = {
  editable: true,
  id: 'accessible-live-editor',
  legacyIds: [],
  load: async () => () => null,
  loadScope: async () => ({}),
  routeId: 'components/LiveEditor/index',
  source: 'export default () => <div>Accessible preview</div>;',
  sourcePath: 'src/LiveEditor/demos/accessible.tsx',
};

beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: vi.fn(),
      matches: false,
      media: '',
      removeEventListener: vi.fn(),
    })),
  );
});

afterEach(cleanup);

afterAll(() => {
  vi.unstubAllGlobals();
});

it('puts textbox semantics on the real react-live contenteditable control', async () => {
  const { container } = render(<LiveEditor appearance="light" demo={descriptor} resetSignal={0} />);

  const editor = await screen.findByRole('textbox', { name: 'Demo source editor' });

  await waitFor(() => expect(editor.hasAttribute('contenteditable')).toBe(true));
  expect(editor.getAttribute('aria-multiline')).toBe('true');
  expect(editor.tabIndex).toBe(0);
  expect(container.querySelector('.demo-live-editor__input')?.hasAttribute('role')).toBe(false);
  expect(container.querySelector('.demo-live-editor__input')?.hasAttribute('aria-label')).toBe(
    false,
  );
});
