/** Run against docs:dev: pnpm exec tsx tests/global-focus-ring.browser.ts http://localhost:<port> */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

import { chromium } from '@playwright/test';

const main = async () => {
  const origin = process.argv[2];
  assert(origin, 'Pass the running docs:dev URL');
  const output = process.env.FOCUS_PROOF_DIR || '/tmp/lobe-global-focus-proof/assets';
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch({
    channel: 'chrome',
  });
  const page = await browser.newPage({ viewport: { height: 720, width: 1000 } });
  const errors: string[] = [];
  const consoleErrors: string[] = [];
  const requestFailures: { url: string; error: string | undefined }[] = [];
  page.on('requestfailed', (request) =>
    requestFailures.push({ url: request.url(), error: request.failure()?.errorText }),
  );
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  const results: string[] = [];
  const check = (name: string) => {
    results.push(`PASS ${name}`);
    console.info(`PASS ${name}`);
  };
  try {
    await page.route('**/__focus-check', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: `<!doctype html><html lang="en"><title>Global keyboard focus verification</title>
      <style>body { font: 16px system-ui; padding: 40px; } button,input { padding: 12px; border-radius: 8px; } #clip { overflow: hidden; width: 360px; height: 140px; margin-top: 40px; border: 1px solid #999; } #edge { margin: 0; } #multiline { display: block; width: 70px; margin-top: 30px; } dialog { padding: 35px; }</style>
      <h1>Global keyboard focus</h1><p>Native controls, with no component focus class.</p>
      <button id="first">First control</button>
      <div id="clip"><button id="edge">Clipped native button</button><input aria-label="Native input" id="input"><div style="height:400px"></div></div>
      <span id="multiline"><a href="#" id="link">A link wrapping across multiple lines</a></span>
      <dialog id="dialog"><button id="inside">Modal button</button></dialog>
      <script type="module">import { installGlobalFocusRing } from '/src/GlobalFocusRing/index.ts'; window.install = installGlobalFocusRing; window.cleanup = installGlobalFocusRing();</script>
      </html>`,
      }),
    );
    await page.goto(`${origin}/__focus-check`);
    await page.waitForFunction(() => !!(window as any).cleanup);
    const settle = () =>
      page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
    const aligned = () =>
      page.evaluate(() => {
        const target = document.activeElement!;
        const ring = document.querySelector('[data-lobe-global-focus-ring]')!;
        const a = target.getBoundingClientRect(),
          b = ring.getBoundingClientRect();
        return (
          ring.matches(':popover-open') &&
          target.getAttribute('data-lobe-focus-ring') === 'managed' &&
          Math.max(
            ...(['top', 'right', 'bottom', 'left'] as const).map((edge) =>
              Math.abs(a[edge] - b[edge]),
            ),
          ) < 1
        );
      });
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#first').evaluate((e) => e === document.activeElement), true);
    assert(await aligned());
    check('keyboard focus on native button');
    await page.keyboard.press('Tab');
    assert(await aligned());
    await page.screenshot({ path: `${output}/clipped-light.png` });
    check('clipping boundary and native outline suppression');
    await page.evaluate(() => {
      document.querySelector('#clip')!.scrollTop = 12;
      (document.querySelector('#clip') as HTMLElement).style.marginLeft = '50px';
      (document.querySelector('#edge') as HTMLElement).style.width = '260px';
    });
    await settle();
    assert(await aligned());
    check('nested scrolling, layout shift, resize');
    assert(
      await page.evaluate(async () => {
        const target = document.activeElement!;
        const animation = target.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(50px)' }],
          { duration: 500, iterations: Infinity, direction: 'alternate' },
        );
        let pass = true;
        for (let i = 0; i < 40; i++) {
          await new Promise(requestAnimationFrame);
          const a = target.getBoundingClientRect(),
            b = document.querySelector('[data-lobe-global-focus-ring]')!.getBoundingClientRect();
          if (Math.abs(a.left - b.left) > 1) pass = false;
        }
        animation.cancel();
        return pass;
      }),
    );
    check('40 animation frames track within 1px');
    await page.evaluate(() => {
      (document.querySelector('#edge') as HTMLElement).style.transform = 'scale(1.1)';
    });
    await settle();
    assert(await aligned());
    check('scale follows bounding box');
    await page.evaluate(() => {
      document.querySelector('#clip')!.scrollTop = 300;
    });
    await settle();
    await page.screenshot({ path: `${output}/scrolled-away.png` });
    // anchors-visible uses strong hiding; CSS visibility/getBoundingClientRect do not expose that paint state.
    check('fully scrolled-out paint captured for visual inspection');
    await page.evaluate(() => {
      (document.querySelector('#dialog') as HTMLDialogElement).showModal();
    });
    await settle();
    assert(await aligned());
    assert.equal(await page.locator('#inside').evaluate((e) => document.activeElement === e), true);
    await page.screenshot({ path: `${output}/modal.png` });
    check('modal top layer and actual focus');
    await page.evaluate(() => {
      (document.querySelector('#dialog') as HTMLDialogElement).close();
      (document.querySelector('#link') as HTMLElement).focus();
    });
    await settle();
    assert.equal(await page.locator('#link').getAttribute('data-lobe-focus-ring'), null);
    assert.equal(
      await page
        .locator('[data-lobe-global-focus-ring]')
        .evaluate((e) => e.matches(':popover-open')),
      false,
    );
    check('multiline links retain native focus');
    await page.evaluate(() => {
      const button = document.createElement('button');
      button.id = 'dynamic';
      button.textContent = 'Dynamic button';
      button.style.setProperty('anchor-name', '--existing', 'important');
      button.style.setProperty('outline', '4px dotted red', 'important');
      document.body.append(button);
      button.focus();
    });
    await settle();
    assert(await aligned());
    await page.evaluate(() => {
      (document.querySelector('#first') as HTMLElement).focus();
    });
    assert.equal(
      await page
        .locator('#dynamic')
        .evaluate((e: HTMLElement) => e.style.getPropertyValue('anchor-name')),
      '--existing',
    );
    assert.equal(
      await page
        .locator('#dynamic')
        .evaluate((e: HTMLElement) => e.style.getPropertyValue('outline')),
      'red dotted 4px',
    );
    check('dynamic controls and original inline styles restored');
    await page.evaluate(() => document.activeElement!.remove());
    await settle();
    assert.equal(
      await page
        .locator('[data-lobe-global-focus-ring]')
        .evaluate((e) => e.matches(':popover-open')),
      false,
    );
    check('removed target clears ring');
    await page.locator('#dynamic').click();
    await settle();
    assert.equal(await page.locator('#dynamic').getAttribute('data-lobe-focus-ring'), null);
    check('pointer focus follows focus-visible semantics');
    await page.locator('#input').click();
    await settle();
    assert(await aligned());
    check('text input focus remains visible after pointer interaction');
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await page.evaluate(() => {
      document.body.style.background = '#141414';
      document.body.style.color = '#eee';
    });
    assert.equal(
      await page
        .locator('[data-lobe-global-focus-ring]')
        .evaluate((e) => getComputedStyle(e).animationName),
      'none',
    );
    await page.screenshot({ path: `${output}/dark-reduced-motion.png` });
    check('dark surface and reduced motion');
    await page.emulateMedia({ forcedColors: 'active' });
    assert.equal(
      await page
        .locator('[data-lobe-global-focus-ring]')
        .evaluate((e) => getComputedStyle(e).outlineWidth),
      '2px',
    );
    check('forced colors visible outline');
    await page.evaluate(() => {
      (window as any).cleanup2 = (window as any).install();
      (window as any).cleanup();
      (window as any).cleanup();
    });
    assert.equal(await page.locator('[data-lobe-global-focus-ring]').count(), 1);
    await page.evaluate(() => (window as any).cleanup2());
    assert.equal(await page.locator('[data-lobe-global-focus-ring]').count(), 0);
    assert.equal(await page.locator('[data-lobe-focus-ring="managed"]').count(), 0);
    check('shared installation, idempotent cleanup and target restoration');
    await page.evaluate(() => {
      const original = CSS.supports;
      CSS.supports = () => false;
      (window as any).install()();
      CSS.supports = original;
    });
    assert.equal(await page.locator('[data-lobe-global-focus-ring]').count(), 0);
    check('unsupported browsers retain native behavior');
    await page.emulateMedia({
      forcedColors: 'none',
      reducedMotion: 'no-preference',
      colorScheme: 'light',
    });
    assert.equal(consoleErrors.length, 0);
    await page.goto(`${origin}/components/config-provider`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-lobe-global-focus-ring]', { state: 'attached' });
    assert.match(await page.title(), /ConfigProvider/);
    assert.match(await page.locator('[aria-current=page]').first().innerText(), /ConfigProvider/);
    await page.keyboard.press('Tab');
    await settle();
    assert(await aligned());
    await page.screenshot({ path: `${output}/docs-native.png` });
    check('ConfigProvider automatically covers native documentation link');
    await page.goto(`${origin}/~demos/src-base-ui-button-demo-demos`);
    await page.waitForSelector('[data-standalone-demo] button');
    await page.keyboard.press('Tab');
    await settle();
    assert(await aligned());
    assert.deepEqual(
      await page.evaluate(() => {
        const style = getComputedStyle(document.activeElement!);
        return { animation: style.animationName, shadow: style.boxShadow };
      }),
      { animation: 'none', shadow: 'none' },
    );
    await page.screenshot({ path: `${output}/base-button.png` });
    check('manifest-backed Base UI demo has one ring without local shadow or animation');
    await page.setViewportSize({ width: 390, height: 844 });
    await settle();
    assert(await aligned());
    check('mobile viewport remains aligned');
    const integrationErrors = [...new Set(consoleErrors)];
    await page.setViewportSize({ width: 1000, height: 720 });
    consoleErrors.length = 0;
    await page.route('**/src/GlobalFocusRing/index.ts*', (route) =>
      route.fulfill({
        contentType: 'text/javascript',
        body: 'export const installGlobalFocusRing = () => { window.__focusDisabled = true; return () => {}; };',
      }),
    );
    await page.goto(`${origin}/components/config-provider`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => (window as any).__focusDisabled);
    await page.waitForSelector('[aria-current=page]', { state: 'attached' });
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('[data-lobe-global-focus-ring]').count(), 0);
    const withoutNetworkErrors = (messages: string[]) =>
      messages.filter((message) => !message.startsWith('Failed to load resource:'));
    assert.deepEqual(
      withoutNetworkErrors(integrationErrors),
      withoutNetworkErrors([...new Set(consoleErrors)]),
    );
    assert.deepEqual(
      requestFailures.filter((failure) => failure.url.startsWith(origin)),
      [],
    );
    if (
      [...integrationErrors, ...consoleErrors].some((message) =>
        message.startsWith('Failed to load resource:'),
      )
    )
      assert(requestFailures.length > 0);

    await writeFile(
      `${output}/console-baseline.txt`,
      JSON.stringify(
        {
          enabled: integrationErrors,
          requestFailures,
          disabled: [...new Set(consoleErrors)],
          conclusion:
            'Documentation console errors reproduce with the global manager disabled; native fixture has none.',
        },
        null,
        2,
      ),
    );
    check('documentation console baseline unchanged with manager disabled');
    assert.deepEqual(errors, []);
    check('no uncaught browser errors');
  } finally {
    await browser.close();
    await writeFile(`${output}/browser.txt`, results.join('\n') + '\n');
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
