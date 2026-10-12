const ROOT = '[data-standalone-demo]';

const within = (page, selector) => page.locator(`${ROOT} ${selector}`);

const hoverEach =
  (selector, limit = 8) =>
  async (page) => {
    const targets = within(page, selector);
    const count = Math.min(await targets.count(), limit);
    for (let index = 0; index < count; index++) {
      await targets.nth(index).hover();
      await page.waitForTimeout(1200);
    }
    await page.mouse.move(0, 0);
  };

const clickEach =
  (selector, limit = 8) =>
  async (page) => {
    const targets = within(page, selector);
    const count = Math.min(await targets.count(), limit);
    for (let index = 0; index < count; index++) {
      await targets
        .nth(index)
        .click({ timeout: 3000 })
        .catch(() => {});
      await page.waitForTimeout(150);
    }
  };

const openAndArrow =
  (trigger, { button = 'left', steps = 8 } = {}) =>
  async (page) => {
    await within(page, trigger).first().click({ button });
    await page.waitForTimeout(300);
    for (let step = 0; step < steps; step++) {
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(60);
    }
    await page.keyboard.press('Escape');
  };

const rightClickText = (text) => async (page) => {
  await page.getByText(text).first().click({ button: 'right' });
  await page.waitForTimeout(300);
  for (let step = 0; step < 8; step++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(60);
  }
  await page.keyboard.press('Escape');
};

const typeInto =
  (selector, text = 'the quick brown fox jumps over') =>
  async (page) => {
    await within(page, selector).first().click();
    await page.keyboard.type(text, { delay: 20 });
  };

const pressKeys = (selector, key, times) => async (page) => {
  await within(page, selector).first().focus();
  for (let step = 0; step < times; step++) {
    await page.keyboard.press(key);
    await page.waitForTimeout(40);
  }
};

const openThenEscape = (selector) => async (page) => {
  await within(page, selector).first().click();
  await page.waitForTimeout(400);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
};

export const scenarios = [
  {
    demo: 'tooltip-demo-group',
    name: 'Tooltip group: hover across triggers',
    run: hoverEach('button'),
  },
  { demo: 'tooltip-demo-demos', name: 'Tooltip: hover triggers', run: hoverEach('button') },
  {
    demo: 'src-base-ui-popover-demo-hover-only',
    name: 'Popover: hover triggers',
    run: hoverEach('button'),
  },
  {
    demo: 'src-base-ui-popover-demo-controlled',
    name: 'Popover: open and close',
    run: openThenEscape('button'),
  },
  {
    demo: 'src-base-ui-select-demo-demos',
    name: 'Select: open and arrow through options',
    run: openAndArrow('[role="combobox"]', { steps: 12 }),
  },
  {
    demo: 'src-dropdown-menu-demo-desc',
    name: 'DropdownMenu: open and arrow through items',
    run: openAndArrow('button'),
  },
  {
    demo: 'src-context-menu-demo-trigger',
    name: 'ContextMenu: open and arrow through items',
    run: rightClickText('Right click this panel'),
  },
  {
    demo: 'src-base-ui-modal-demo-demos',
    name: 'Modal: open and close',
    run: openThenEscape('button'),
  },
  {
    demo: 'src-base-ui-tabs-demo-demos',
    name: 'Tabs: click each tab',
    run: clickEach('[role="tab"]'),
  },
  {
    demo: 'src-base-ui-segmented-demo-demos',
    name: 'Segmented: click each option',
    run: clickEach('[role="group"] button'),
  },
  {
    demo: 'src-base-ui-switch-demo-demos',
    name: 'Switch: toggle each',
    run: clickEach('[role="switch"]'),
  },
  {
    demo: 'src-base-ui-slider-demo-demos',
    name: 'Slider: arrow 20 steps',
    run: pressKeys('input[type="range"]', 'ArrowRight', 20),
  },
  { demo: 'src-search-bar-demo-demos', name: 'SearchBar: type 30 chars', run: typeInto('input') },
  {
    demo: 'src-editable-text-demo-demos',
    name: 'EditableText: edit and type',
    run: async (page) => {
      await within(page, 'button').first().click();
      await page.keyboard.type(' appended text', { delay: 20 });
    },
  },
  {
    demo: 'src-color-swatches-demo-demos',
    name: 'ColorSwatches: pick each swatch',
    run: clickEach('[role="button"], button'),
  },
  {
    demo: 'src-base-ui-toast-demo-demos',
    name: 'Toast: trigger toasts',
    run: clickEach('button', 5),
  },
  {
    demo: 'video-demo-demos',
    name: 'Video: play 2s then seek',
    tolerance: 0.05,
    run: async (page) => {
      await within(page, 'button[aria-label="Play"]').first().click();
      await page.waitForTimeout(2000);
      await pressKeys('[role="slider"][aria-label="Seek"]', 'ArrowRight', 10)(page);
    },
  },
  {
    demo: 'src-highlighter-demo-demos',
    name: 'Highlighter: copy code',
    run: clickEach('button', 1),
  },
  {
    demo: 'src-markdown-demo-streamingbench',
    name: 'Markdown: stream bench content',
    query: { delay: '50', size: '20' },
    tolerance: 0.1,
    run: async (page) => {
      await within(page, 'button[data-phase]').click();
      await within(page, 'button[data-phase="done"]').waitFor({ timeout: 60_000 });
    },
  },
];
