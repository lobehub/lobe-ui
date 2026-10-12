# render bench

Counts React renders per component on the docs demos with [bippy](https://github.com/aidenybai/bippy) (react-scan's engine),
for the v6 render-granularity audit. Each run records the mount of a demo and, for scenarios, one scripted
interaction; every render is split into necessary vs unnecessary and tagged with what changed (props, state,
context).

```bash
pnpm docs:dev                                                            # note the port it prints
node scripts/render-bench/bench.mjs --url http://localhost:5173          # interaction scenarios
node scripts/render-bench/bench.mjs --url http://localhost:5173 --mounts # mount pass over every src/ demo
node scripts/render-bench/bench.mjs --url http://localhost:5173 --only 'Select: open and arrow through options'
```

Results land in `scripts/render-bench/results/` (`scenarios.json`, `mounts.json`). The committed baseline lives in
`scripts/render-bench/baseline/`.

```bash
node scripts/render-bench/report.mjs scripts/render-bench/results/scenarios.json # table, worst first
node scripts/render-bench/report.mjs scripts/render-bench/results/scenarios.json \
  scripts/render-bench/baseline/scenarios.json # exits 1 when a scenario renders more than the baseline (beyond its tolerance)
```

Scenarios live in `scenarios.mjs`: a demo id from `compatibility.json` plus an async `run(page)` that drives
the interaction inside `[data-standalone-demo]`. Optional `query` adds URL search params (the Markdown scenario
uses it to shorten `streamingBench`), and `tolerance` allows timing-driven scenarios a relative margin.

Counts come from a dev build; compare runs against each other, not against production numbers. Set `BENCH_CHROMIUM` to a Chromium binary if Playwright's bundled one is not
installed. Do not run the bench while a build or type-check is running.
