# streamdown CPU bench

Measures renderer + GPU process CPU of the streaming markdown demo on a production docs build,
using `ps -o cputime` deltas over one full stream. Needs `agent-browser` on PATH.

```bash
pnpm docs:build
cp -R .react-router/build/client /tmp/sd-dist # keep a copy per variant
node scripts/streamdown-bench/serve.mjs /tmp/sd-dist 4174
node scripts/streamdown-bench/bench.mjs \
  "http://localhost:4174/~demos/src-markdown-demo-streamingbench?size=5&delay=50&granularity=char&preset=balanced" label
node scripts/streamdown-bench/bench.mjs "...&content=list" label-list # list-heavy content
scripts/streamdown-bench/repro.sh http://localhost:4174               # skipped@birth must be 0
```

Bench params: `size` / `delay` (chunk chars / ms), `granularity=char|word`, `preset=balanced|realtime|silky`,
`anim=0` disables the CSS fade, `content=list` switches to the list-heavy sample.

Do not overlap a run with builds or type-checks; the numbers are whole-process CPU.
Reference (2026-09-06, M-series, char/balanced): default content ≈ 8.5% renderer / 2.5% GPU,
list content ≈ 11% / 4.3%.

## Fade reset probe

`probe.sh <bench-url>` injects `opacity-probe.js`, which samples every rendered char's computed
opacity per animation frame and records any char whose opacity dropped by 0.3 or more between two frames (a replayed fade).
A healthy run prints `resets 0`; each event shows the element the char lived in before and after.

```bash
scripts/streamdown-bench/probe.sh "http://localhost:4174/~demos/src-markdown-demo-streamingbench?size=5&delay=50"
```
