/**
 * Real-browser check for the ScrollArea `scrollFade` mask (jsdom has no scroll timelines).
 *
 * Run: bun tests/scroll-area-fade.browser.ts [path/to/global.css]
 *
 * The fixtures mirror what Base UI renders on the viewport: the fade class plus
 * `data-has-overflow-x` / `data-has-overflow-y` only when that axis can scroll.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { chromium } from '@playwright/test';

const cssPath = path.resolve(process.argv[2] ?? 'src/ScrollArea/global.css');

const fixture = (id: string, className: string, attrs: string, content: string) =>
  `<div id="${id}" class="${className}" ${attrs} style="overflow:auto;width:200px;height:100px">${content}</div>`;

const short = '<div style="width:100px;height:50px"></div>';
const tall = '<div style="width:100px;height:400px"></div>';
const wide = '<div style="width:800px;height:50px"></div>';
const big = '<div style="width:800px;height:400px"></div>';

const main = async () => {
  const css = await readFile(cssPath, 'utf8');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><style>${css}</style>
    ${fixture('v-static', 'lobe-scroll-area-fade', '', short)}
    ${fixture('v-scroll', 'lobe-scroll-area-fade', 'data-has-overflow-y', tall)}
    ${fixture('v-shrink', 'lobe-scroll-area-fade', 'data-has-overflow-y', '<div id="v-shrink-content" style="height:400px"></div>')}
    ${fixture('h-static', 'lobe-scroll-area-fade-horizontal', '', short)}
    ${fixture('h-scroll', 'lobe-scroll-area-fade-horizontal', 'data-has-overflow-x', wide)}
    ${fixture('b-static', 'lobe-scroll-area-fade-both', '', short)}
    ${fixture('b-y', 'lobe-scroll-area-fade-both', 'data-has-overflow-y', tall)}
    ${fixture('b-x', 'lobe-scroll-area-fade-both', 'data-has-overflow-x', wide)}
    ${fixture('b-xy', 'lobe-scroll-area-fade-both', 'data-has-overflow-x data-has-overflow-y', big)}`);

  /** Scrolls the fixture, waits for the scroll timeline to tick, then reads its fade state. */
  const read = (id: string, scroll: { left?: number; top?: number } = {}) =>
    page.evaluate(
      async ([id, scroll]) => {
        const el = document.getElementById(id)!;
        if (scroll.top !== undefined) el.scrollTop = scroll.top;
        if (scroll.left !== undefined) el.scrollLeft = scroll.left;
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const style = getComputedStyle(el);
        return {
          animations: el
            .getAnimations()
            .map((a) => (a as CSSAnimation).animationName)
            .sort(),
          bottom: style.getPropertyValue('--lobe-scroll-area-fade-bottom').trim(),
          top: style.getPropertyValue('--lobe-scroll-area-fade-top').trim(),
        };
      },
      [id, scroll] as const,
    );

  const results: string[] = [];
  const check = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn();
      results.push(`PASS ${name}`);
    } catch (error) {
      results.push(`FAIL ${name}: ${(error as Error).message.replaceAll(/\s+/g, ' ')}`);
    }
  };

  const y = ['lobe-scroll-area-fade-bottom-out', 'lobe-scroll-area-fade-top-in'];
  const x = ['lobe-scroll-area-fade-left-in', 'lobe-scroll-area-fade-right-out'];

  await check('vertical, not scrollable: no fade on either edge', async () => {
    const s = await read('v-static');
    assert.deepEqual([s.top, s.bottom], ['0px', '0px']);
    assert.deepEqual(s.animations, []);
  });
  // Production repro (LobeHub desktop sidebar): scrolled past 40px, then the content shrank to fit.
  // Chromium keeps the now-inactive timeline at progress 1, pinning fade-top at 40px.
  await check('vertical, scrolled then content shrinks to fit: no stale top fade', async () => {
    await read('v-shrink', { top: 150 });
    await page.evaluate(() => {
      document.getElementById('v-shrink-content')!.style.height = '50px';
      document.getElementById('v-shrink')!.removeAttribute('data-has-overflow-y');
    });
    const s = await read('v-shrink');
    assert.deepEqual([s.top, s.bottom], ['0px', '0px']);
  });
  await check('vertical, scrollable at top: bottom fade only', async () => {
    const s = await read('v-scroll', { top: 0 });
    assert.deepEqual(s.animations, y);
    assert.deepEqual([s.top, s.bottom], ['0px', '40px']);
  });
  await check('vertical, scrollable mid-way: both fades', async () => {
    const s = await read('v-scroll', { top: 150 });
    assert.deepEqual([s.top, s.bottom], ['40px', '40px']);
  });
  await check('vertical, scrollable 20px from top: fade eases in', async () => {
    const s = await read('v-scroll', { top: 20 });
    assert.equal(s.top, '20px');
  });
  await check('vertical, scrollable at bottom: top fade only', async () => {
    const s = await read('v-scroll', { top: 300 });
    assert.deepEqual([s.top, s.bottom], ['40px', '0px']);
  });
  await check('horizontal, not scrollable: no fade animation', async () => {
    assert.deepEqual((await read('h-static')).animations, []);
  });
  await check('horizontal, scrollable: x fade animations', async () => {
    assert.deepEqual((await read('h-scroll')).animations, x);
  });
  await check('both, not scrollable: no fade', async () => {
    const s = await read('b-static');
    assert.deepEqual([s.top, s.bottom], ['0px', '0px']);
    assert.deepEqual(s.animations, []);
  });
  await check('both, only y scrollable: y fades only', async () => {
    const s = await read('b-y', { top: 150 });
    assert.deepEqual(s.animations, y);
    assert.deepEqual([s.top, s.bottom], ['40px', '40px']);
  });
  await check('both, only x scrollable: no vertical fade', async () => {
    const s = await read('b-x');
    assert.deepEqual([s.top, s.bottom], ['0px', '0px']);
    assert.deepEqual(s.animations, x);
  });
  await check('both, both axes scrollable: all four fades', async () => {
    assert.deepEqual((await read('b-xy')).animations, [...x, ...y].sort());
  });

  await browser.close();
  console.info(results.join('\n'));
  if (results.some((line) => line.startsWith('FAIL'))) process.exit(1);
};

void main();
