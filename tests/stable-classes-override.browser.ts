/** Run against a served docs build: pnpm exec tsx tests/stable-classes-override.browser.ts http://localhost:<port> */
import assert from 'node:assert/strict';

import { chromium } from '@playwright/test';

const main = async () => {
  const origin = process.argv[2];
  assert(origin, 'Pass the served docs URL');
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { height: 900, width: 1200 } });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(`${origin}/styling-overrides`, { waitUntil: 'networkidle' });
    await page.locator('#override-switch .lobe-switch__thumb').waitFor();

    const computed = (selector: string, property: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);

    assert.equal(
      await computed('#override-switch .lobe-switch__thumb', 'background-color'),
      'rgb(255, 0, 0)',
    );
    console.info('PASS switch thumb override beats StyleX');

    assert.equal(
      await computed('#override-panel .lobe-draggable-panel__content', 'background-color'),
      'rgb(0, 0, 255)',
    );
    console.info('PASS draggable panel content override beats StyleX');

    assert.equal(await computed('.lobe-popover', 'border-top-left-radius'), '3px');
    console.info('PASS portal popover override beats StyleX');

    const layered = await page.evaluate(async () => {
      const hrefs = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map(
        (link) => link.href,
      );
      const sheets = await Promise.all(hrefs.map((href) => fetch(href).then((r) => r.text())));
      return sheets.some((css) => /@layer\s+lobe-base\s*,\s*lobe-popup\s*,\s*lobe-ui/.test(css));
    });
    assert.ok(layered, 'served CSS declares @layer lobe-base, lobe-popup, lobe-ui');
    console.info('PASS served CSS is layered');

    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
