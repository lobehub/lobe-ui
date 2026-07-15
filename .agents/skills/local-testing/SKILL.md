---
name: local-testing
description: >
  Local browser verification for the lobe-ui component library and documentation site.
  Uses agent-browser against the React Router and Vite development server, including
  component pages, manifest-backed standalone demos, theme states, and responsive layouts.
  Trigger on local test, UI test, verify component, test in browser, visual check, or screenshot demo.
---

# Local UI Automation Testing

Use `agent-browser` to verify the local documentation site visually and programmatically.

| Layer                            | Command or tool                   | Authority                      |
| -------------------------------- | --------------------------------- | ------------------------------ |
| Development server               | `bun run docs:dev`                | React Router and Vite          |
| Documentation routes             | `site/content/compatibility.json` | Frozen path authority          |
| Navigation and document registry | Compiled content manifest         | Runtime result                 |
| Standalone demo routes           | `site/content/compatibility.json` | Frozen compatibility inventory |
| Browser automation               | `agent-browser`                   | Chromium through CDP           |

Do not assume a fixed port or derive standalone IDs from filenames. The server selects the first
available port, while the compatibility manifest is the route authority.

## Start or reuse the development server

Prefer the server already associated with the current task. Otherwise start one in the background
and retain its log for port discovery and error inspection:

```bash
LOG=/tmp/lobe-ui-docs-dev.log
nohup bun run docs:dev > "$LOG" 2>&1 &
disown
```

Wait for the actual URL emitted by Vite. The log contains a value matching
`http://localhost:[0-9]+`; never substitute a hard-coded default.

```bash
LOG=/tmp/lobe-ui-docs-dev.log
for i in $(seq 1 60); do
  URL=$(grep -Eo 'http://localhost:[0-9]+' "$LOG" | head -1)
  [ -n "$URL" ] && curl -fsS -o /dev/null "$URL" && break
  sleep 1
done
test -n "$URL"
printf '%s\n' "$URL"
```

If no URL appears, inspect the complete log before retrying. Do not start multiple servers merely
because an expected port is occupied.

## Select a route from repository manifests

Documentation pathnames are frozen in `site/content/compatibility.json`; this is the path authority.
The content manifest is the compiled runtime result. For a known document source, query its canonical
public path before opening it:

```bash
SOURCE='src/Button/index.mdx'
DOC_PATH=$(jq -r --arg source "$SOURCE" \
  '.documents[] | select(.source == $source) | .pathname' \
  site/content/compatibility.json)
test -n "$DOC_PATH"
agent-browser open "$URL$DOC_PATH"
```

Standalone demo IDs come from `site/content/compatibility.json`. Query the manifest by source path:

```bash
SOURCE='src/Button/demos/index.tsx'
jq -r --arg source "$SOURCE" \
  '.demoReferences[] | select(.source == $source) | "/~demos/" + .legacyId' \
  site/content/compatibility.json
```

Open the returned route directly. This preserves legacy IDs such as `/~demos/docs-demo-docs` and
avoids reimplementing the canonical-ID algorithm in shell code.

```bash
agent-browser open "$URL/~demos/docs-demo-docs"
agent-browser wait --load networkidle
agent-browser snapshot -i
```

Use the full documentation page when verifying navigation, API tables, search, table of contents,
or the relationship between several demos. Use the standalone route for isolated component
interaction and rendering checks.

## Stable selectors

Prefer accessible names and repository-owned state attributes over generated class names.

| Surface                   | Stable selector                                                     |
| ------------------------- | ------------------------------------------------------------------- |
| Active documentation link | `[aria-current="page"]`                                             |
| Standalone demo root      | `[data-standalone-demo]`                                            |
| Demo appearance           | `[data-demo-appearance="light"]` or `[data-demo-appearance="dark"]` |
| Demo editability          | `[data-demo-editable="true"]` or `[data-demo-editable="false"]`     |
| Demo layout               | `[data-demo-layout]`                                                |
| Live preview state        | `[data-live-state="active"]`                                        |
| Documentation navigation  | `[aria-label="Component documentation"]`                            |
| Search dialog             | `[aria-label="Search documentation"]`                               |
| Source editor             | `[aria-label="Demo source editor"]`                                 |

Use role and accessible-name queries for desktop controls:

```bash
agent-browser click 'button[aria-label="Search documentation"]'
agent-browser fill 'input[aria-label="Search documentation"]' 'Button'
agent-browser click 'button[aria-label="Use dark demo theme"]'
agent-browser eval 'document.querySelector("[aria-current=page]")?.textContent'
```

After switching to a mobile viewport, use `button[aria-label="Open search"]` from the header.

Re-run `agent-browser snapshot -i` after every navigation or hot update because element references
may have been invalidated.

## Capture runtime failures

Install an interceptor before interaction when the scenario can trigger asynchronous rendering:

```bash
agent-browser eval --stdin << 'EVALEOF'
(function () {
  window.__CAPTURED_ERRORS = [];
  var originalError = console.error;
  console.error = function () {
    var message = Array.from(arguments).map(function (value) {
      if (value instanceof Error) return value.stack || value.message;
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }).join(' ');
    window.__CAPTURED_ERRORS.push(message);
    originalError.apply(console, arguments);
  };
  window.addEventListener('error', function (event) {
    window.__CAPTURED_ERRORS.push('window.onerror: ' + (event.error?.stack || event.message));
  });
  window.addEventListener('unhandledrejection', function (event) {
    window.__CAPTURED_ERRORS.push('unhandledrejection: ' + (event.reason?.stack || event.reason));
  });
  return 'installed';
})()
EVALEOF
```

After interaction, collect browser and server evidence:

```bash
agent-browser eval 'JSON.stringify(window.__CAPTURED_ERRORS || [])'
tail -n 100 /tmp/lobe-ui-docs-dev.log | rg -i 'error|warn|failed'
```

Treat hydration warnings, uncaught exceptions, unhandled rejections, and failed module loads as
test failures. A screenshot without these checks is insufficient.

## Required verification flow

For a component change, exercise the smallest complete flow:

1. Open the canonical documentation path and confirm the expected title.
2. Confirm the current sidebar entry through `[aria-current="page"]`.
3. Open the manifest-backed standalone route and confirm `[data-standalone-demo]` exists.
4. Exercise every changed interaction using accessible control names.
5. Verify relevant light and dark appearance states through `[data-demo-appearance]`.
6. Verify desktop and mobile viewport behavior when layout is affected.
7. Capture a screenshot for visual evidence and inspect semantic state with `eval`.
8. Drain captured browser errors and inspect the development-server log.

Example semantic inspection:

```bash
agent-browser eval --stdin << 'EVALEOF'
JSON.stringify({
  activeLink: document.querySelector('[aria-current="page"]')?.textContent?.trim(),
  appearance: document.querySelector('[data-demo-appearance]')?.getAttribute('data-demo-appearance'),
  editable: document.querySelector('[data-demo-editable]')?.getAttribute('data-demo-editable'),
  standalone: Boolean(document.querySelector('[data-standalone-demo]')),
})
EVALEOF
```

## Cleanup

Keep the server alive across related iterations. When explicit cleanup is required, derive its port
from the same log and stop only that listener:

```bash
PORT=$(grep -Eo 'http://localhost:[0-9]+' /tmp/lobe-ui-docs-dev.log | head -1 | sed 's/.*://')
PIDS=$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t)
[ -n "$PIDS" ] && kill $PIDS
```

Do not close all browser sessions or terminate unrelated development servers.
