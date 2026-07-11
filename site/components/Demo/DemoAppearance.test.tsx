import { readFileSync } from 'node:fs';
import path from 'node:path';

const demoStyles = readFileSync(
  path.resolve(process.cwd(), 'site/components/Demo/Demo.css'),
  'utf8',
);
let container: HTMLDivElement;
let style: HTMLStyleElement;

beforeEach(() => {
  style = document.createElement('style');
  style.textContent = demoStyles;
  document.head.append(style);
  container = document.createElement('div');
  document.body.append(container);
});

afterEach(() => {
  container.remove();
  style.remove();
  delete document.documentElement.dataset.standaloneAppearance;
  delete document.documentElement.dataset.theme;
});

const matchingAppearanceRule = (
  target: Element,
  appearance: 'dark' | 'light',
): CSSStyleRule | undefined =>
  [...style.sheet!.cssRules]
    .filter((rule): rule is CSSStyleRule => 'selectorText' in rule)
    .find(
      (rule) =>
        rule.style.getPropertyValue('color-scheme') === appearance &&
        rule.selectorText.split(',').some((selector) => target.matches(selector.trim())),
    );

it.each([
  ['light', '#fff', '#111113'],
  ['dark', '#0d0d0f', '#f4f4f5'],
] as const)(
  'applies an explicit %s canvas to embedded, live, and standalone previews',
  (appearance, background, color) => {
    document.documentElement.dataset.theme = appearance === 'light' ? 'dark' : 'light';
    container.innerHTML = `
      <div class="demo-frame__viewport" data-demo-appearance="${appearance}">
        <div class="demo-frame__preview" data-preview="embedded"></div>
      </div>
      <div class="demo-live-editor__preview" data-demo-appearance="${appearance}" data-preview="live"></div>
      <main class="standalone-demo-page" data-demo-appearance="${appearance}" data-preview="standalone"></main>`;

    for (const target of container.querySelectorAll<HTMLElement>('[data-preview]')) {
      const rule = matchingAppearanceRule(target, appearance);
      expect(rule?.style.getPropertyValue('background')).toBe(background);
      expect(rule?.style.getPropertyValue('color')).toBe(color);
    }
  },
);

it('applies the pre-hydration standalone appearance marker before page attributes exist', () => {
  document.documentElement.dataset.standaloneAppearance = 'dark';
  container.innerHTML = '<main class="standalone-demo-page"></main>';

  expect(
    matchingAppearanceRule(container.querySelector('main')!, 'dark')?.style.getPropertyValue(
      'background',
    ),
  ).toBe('#0d0d0f');
});

it('keeps pending live candidates measurable while making their entire subtree non-interactive', () => {
  container.innerHTML = `
    <div class="demo-live-editor__stage">
      <div class="demo-live-editor__candidate" data-live-state="candidate" aria-hidden="true" inert>
        <div data-lobe-portal-host><div role="dialog">Pending overlay</div></div>
      </div>
    </div>`;
  const stage = container.querySelector<HTMLElement>('.demo-live-editor__stage')!;
  const candidate = container.querySelector<HTMLElement>('[data-live-state="candidate"]')!;
  const rules = [...style.sheet!.cssRules].filter(
    (rule): rule is CSSStyleRule => 'selectorText' in rule,
  );
  const stageRule = rules.find(
    (rule) =>
      rule.selectorText.includes('.demo-live-editor__stage') &&
      rule.selectorText.split(',').some((selector) => stage.matches(selector.trim())),
  );
  const pendingRule = rules.find(
    (rule) =>
      rule.selectorText.includes("[data-live-state='candidate']") &&
      rule.style.getPropertyValue('visibility') === 'hidden' &&
      rule.selectorText.split(',').some((selector) => candidate.matches(selector.trim())),
  );

  expect(candidate.hasAttribute('hidden')).toBe(false);
  expect(candidate.getAttribute('aria-hidden')).toBe('true');
  expect(candidate.hasAttribute('inert')).toBe(true);
  expect(stageRule?.style.getPropertyValue('display')).toBe('grid');
  expect(pendingRule?.style.getPropertyValue('opacity')).toBe('0');
  expect(pendingRule?.style.getPropertyValue('pointer-events')).toBe('none');
  expect(pendingRule?.style.getPropertyValue('display')).not.toBe('none');
});
