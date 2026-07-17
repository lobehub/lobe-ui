import { styles } from './style';

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.append(container);
});

afterEach(() => {
  container.remove();
  delete document.documentElement.dataset.standaloneAppearance;
  delete document.documentElement.dataset.theme;
});

const serializeColor = (value: string): string => {
  const probe = document.createElement('span');
  probe.style.color = value;
  document.body.append(probe);
  const serialized = getComputedStyle(probe).color;
  probe.remove();
  return serialized;
};

it.each([
  ['light', '#fff', '#111113'],
  ['dark', '#0d0d0f', '#f4f4f5'],
] as const)(
  'applies an explicit %s canvas to embedded, live, and standalone previews',
  (appearance, background, color) => {
    document.documentElement.dataset.theme = appearance === 'light' ? 'dark' : 'light';
    container.innerHTML = `
      <div class="${styles.viewport}" data-demo-appearance="${appearance}">
        <div class="${styles.preview}" data-preview="embedded"></div>
      </div>
      <div class="${styles.viewport}" data-demo-appearance="${appearance}">
        <div class="${styles.preview}" data-preview="live">
          <div class="${styles.liveStage}"></div>
        </div>
      </div>
      <main class="${styles.standalonePage}" data-demo-appearance="${appearance}" data-preview="standalone"></main>`;

    for (const target of container.querySelectorAll<HTMLElement>('[data-preview]')) {
      const computed = getComputedStyle(target);
      expect(computed.backgroundColor).toBe(serializeColor(background));
      expect(computed.color).toBe(serializeColor(color));
      expect(computed.colorScheme).toBe(appearance);
    }
  },
);

it('applies the pre-hydration standalone appearance marker before page attributes exist', () => {
  document.documentElement.dataset.standaloneAppearance = 'dark';
  container.innerHTML = `<main class="${styles.standalonePage}" data-standalone-demo=""></main>`;

  expect(getComputedStyle(container.querySelector('main')!).backgroundColor).toBe(
    serializeColor('#0d0d0f'),
  );
});

it('gives the provider-wrapped standalone demo a full-width grid track', () => {
  container.innerHTML = `
    <main class="${styles.standalonePage}" data-standalone-demo="">
      <div data-lobe-demo-appearance="dark" style="display: contents">
        <div data-demo-provider="">
          <div id="lobe-demo-example"></div>
        </div>
      </div>
    </main>`;

  const appearance = container.querySelector<HTMLElement>('[data-lobe-demo-appearance]')!;
  const standalonePage = container.querySelector<HTMLElement>('[data-standalone-demo]')!;
  expect(getComputedStyle(standalonePage).gridTemplateColumns).toBe('minmax(0, 1fr)');
  expect(getComputedStyle(appearance).width).toBe('100%');
});

it('keeps pending live candidates measurable while making their entire subtree non-interactive', () => {
  container.innerHTML = `
    <div class="${styles.liveStage}">
      <div class="${styles.liveCandidate}" data-live-state="candidate" aria-hidden="true" inert>
        <div data-lobe-portal-host><div role="dialog">Pending overlay</div></div>
      </div>
    </div>`;
  const stage = container.querySelector<HTMLElement>(`.${styles.liveStage}`)!;
  const candidate = container.querySelector<HTMLElement>('[data-live-state="candidate"]')!;
  const stageStyle = getComputedStyle(stage);
  const candidateStyle = getComputedStyle(candidate);

  expect(candidate.hasAttribute('hidden')).toBe(false);
  expect(candidate.getAttribute('aria-hidden')).toBe('true');
  expect(candidate.hasAttribute('inert')).toBe(true);
  expect(stageStyle.display).toBe('grid');
  expect(candidateStyle.opacity).toBe('0');
  expect(candidateStyle.pointerEvents).toBe('none');
  expect(candidateStyle.visibility).toBe('hidden');
  expect(candidateStyle.display).not.toBe('none');
});
