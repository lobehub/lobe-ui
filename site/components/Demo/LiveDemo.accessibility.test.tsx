import { cleanup, render, screen, waitFor } from '@testing-library/react';

import type { DemoAppearance, DemoModule } from '../../types/demo';
import { LiveDemo } from './LiveDemo';
import { styles } from './style';

interface HarnessProps {
  appearance: DemoAppearance;
  demo: DemoModule;
  resetSignal: number;
}

const Harness = (props: HarnessProps) => (
  <LiveDemo expanded sourcePanelId="live-demo-source" viewport="responsive" {...props} />
);

const descriptor: DemoModule = {
  editable: true,
  id: 'accessible-live-editor',
  legacyIds: [],
  load: async () => () => null,
  loadScope: async () => ({}),
  routeId: 'components/LiveDemo/index',
  source: 'export default () => <div>Accessible preview</div>;',
  sourcePath: 'src/LiveDemo/demos/accessible.tsx',
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
  const { container } = render(<Harness appearance="light" demo={descriptor} resetSignal={0} />);

  const editor = await screen.findByRole('textbox', { name: 'Demo source editor' });

  await waitFor(() => expect(editor.hasAttribute('contenteditable')).toBe(true));
  expect(editor.getAttribute('aria-multiline')).toBe('true');
  expect(editor.tabIndex).toBe(0);
  expect(container.querySelector(`.${styles.liveInput}`)?.hasAttribute('role')).toBe(false);
  expect(container.querySelector(`.${styles.liveInput}`)?.hasAttribute('aria-label')).toBe(false);
});
