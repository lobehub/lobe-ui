import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { chromium } from '@playwright/test';

import { scenarios } from './scenarios.mjs';

const { values } = parseArgs({
  options: {
    mounts: { default: false, type: 'boolean' },
    only: { type: 'string' },
    out: { default: 'scripts/render-bench/results', type: 'string' },
    url: { default: 'http://localhost:5173', type: 'string' },
  },
});

const bundleProbe = async () => {
  const { build } = await import('vite');
  const output = await build({
    build: {
      lib: {
        entry: fileURLToPath(new URL('probe.mjs', import.meta.url)),
        formats: ['iife'],
        name: 'renderBenchProbe',
      },
      minify: false,
      write: false,
    },
    configFile: false,
    logLevel: 'silent',
  });
  return (Array.isArray(output) ? output[0] : output).output[0].code;
};

const probeScript = await bundleProbe();

const snapshot = (page) =>
  page.evaluate(() => {
    const data = window.__renderBench.byComponent;
    window.__renderBench.byComponent = {};
    return data;
  });

const settle = async (page, { quietMs = 500, timeoutMs = 8000 } = {}) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const idle = await page.evaluate(
      (quiet) => performance.now() - window.__renderBench.lastRenderAt > quiet,
      quietMs,
    );
    if (idle) return;
    await page.waitForTimeout(100);
  }
};

const summarize = (byComponent) => {
  const rows = Object.entries(byComponent).map(([name, entry]) => ({ name, ...entry }));
  const total = (key) => rows.reduce((sum, row) => sum + row[key], 0);
  return {
    components: rows.toSorted((a, b) => b.renders - a.renders).slice(0, 20),
    totals: {
      context: total('context'),
      parent: total('parent'),
      props: total('props'),
      renders: total('renders'),
      state: total('state'),
      unnecessary: total('unnecessary'),
    },
  };
};

const runOne = async (context, { demo, name, query, run, tolerance = 0 }) => {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const search = new URLSearchParams({ appearance: 'light', ...query });
  await page.goto(`${values.url}/~demos/${demo}?${search}`, { waitUntil: 'load' });
  await page.waitForSelector('[data-standalone-demo]', { timeout: 30_000 });
  await page
    .waitForFunction(() => !document.body.innerText.includes('Loading preview'), null, {
      timeout: 30_000,
    })
    .catch(() => errors.push('preview never finished loading'));
  await settle(page);
  const mount = summarize(await snapshot(page));
  let interaction;
  if (run) {
    await run(page);
    await settle(page);
    interaction = summarize(await snapshot(page));
  }
  await page.close();
  return { demo, errors, interaction, mount, name, tolerance };
};

const listDemoIds = () => {
  const manifest = JSON.parse(readFileSync('compatibility.json', 'utf8'));
  return [
    ...new Set(
      manifest.demoReferences
        .filter((reference) => reference.source.startsWith('src/'))
        .map((reference) => reference.legacyId),
    ),
  ];
};

const jobs = values.mounts
  ? listDemoIds().map((demo) => ({ demo, name: demo }))
  : scenarios.filter((scenario) => !values.only || scenario.name === values.only);

const browser = await chromium.launch({ executablePath: process.env.BENCH_CHROMIUM || undefined });
const context = await browser.newContext({
  reducedMotion: 'reduce',
  viewport: { height: 900, width: 1280 },
});
await context.addInitScript({ content: probeScript });

mkdirSync(values.out, { recursive: true });
const results = [];
for (const job of jobs) {
  try {
    const result = await runOne(context, job);
    results.push(result);
    const scope = result.interaction ?? result.mount;
    console.log(
      `${job.name}: ${scope.totals.renders} renders, ${scope.totals.unnecessary} unnecessary`,
    );
  } catch (error) {
    results.push({ demo: job.demo, errors: [String(error)], name: job.name });
    console.log(`${job.name}: failed (${String(error).split('\n')[0]})`);
  }
}
await browser.close();

const file = path.join(values.out, values.mounts ? 'mounts.json' : 'scenarios.json');
writeFileSync(file, `${JSON.stringify(results, null, 2)}\n`);
console.log(`wrote ${file}`);
