# PROJECT.md — acceptance adapter for @lobehub/ui

## 1. Project summary

`@lobehub/ui` is the React component library behind LobeHub's web products. It ships
ESM only, from `src/**` to `es/**` via tsdown, and publishes nothing else.

Repo layout that matters for testing:

| Path                 | What it is                                                                |
| -------------------- | ------------------------------------------------------------------------- |
| `src/<Component>/`   | One component: implementation, `style.ts`, `index.mdx`, `demos/`          |
| `src/base-ui/`       | Components built on `@base-ui/react` — published as `@lobehub/ui/base-ui` |
| `packages/docs-kit/` | `lobedocs`, the React Router + Vite toolkit that builds the docs site     |
| `es/`                | Build output; the only directory published to npm                         |

A component change has two proving surfaces: the **docs site**, which renders every
component's demos, and a **consuming app** running the built package. Library changes
that alter geometry or interaction should be proven on both — the docs site is fast,
the consuming app proves the shipped artifact.

## 2. Environment

- **Start docs server:** `pnpm run docs:dev` (Vite picks the first free port from
  5173; read the real URL from the log, never assume one)
- **Stop docs server:** derive the port from the log and kill only that listener
- **Build the package:** `pnpm build` → `es/` (required before any consuming-app run)
- **Required services:** none — the docs site is static-rendered and needs no
  database, cache, or queue
- **Detect already running:** `lsof -nP -iTCP:<port> -sTCP:LISTEN -t`; reuse the
  server already associated with the task rather than starting a second one

```bash
LOG=/tmp/lobe-ui-docs-dev.log
nohup pnpm run docs:dev > "$LOG" 2>&1 &
disown
for i in $(seq 1 60); do
  URL=$(grep -Eo 'http://localhost:[0-9]+' "$LOG" | head -1)
  [ -n "$URL" ] && curl -fsS -o /dev/null "$URL" && break
  sleep 1
done
printf '%s\n' "$URL"
```

## 3. Auth

None. The docs site is entirely public and has no accounts, sessions, or seeding.
Per-surface status check: `curl -fsS -o /dev/null -w '%{http_code}' "$URL"` returning
`200` is the whole gate.

A consuming app may have its own auth; that belongs to the consuming app's adapter,
not this one.

## 4. Surfaces

| Surface             | Applies | Launch                                   | Base URL       | Session   |
| ------------------- | ------- | ---------------------------------------- | -------------- | --------- |
| Web — docs site     | yes     | `pnpm run docs:dev`                      | from the log   | `lobe-ui` |
| Web — consuming app | yes     | the app's own dev command, against `es/` | the app's port | `lobe-ui` |
| CLI                 | no      | —                                        | —              | —         |
| Electron            | no      | —                                        | —              | —         |

**Consuming-app runs must load this working tree's build, not the published package.**
Replace `es/` inside the app's resolved package directory and keep the original:

```bash
APP=/path/to/consuming-app
LIB=/path/to/lobe-ui

STORE=$(cd "$APP/node_modules/@lobehub" && cd "$(dirname "$(readlink ui)")" && pwd)/ui
[ -d "$STORE/es.orig" ] || mv "$STORE/es" "$STORE/es.orig" # keep the published build
rm -rf "$STORE/es" && cp -R "$LIB/es" "$STORE/es"
# restore:  rm -rf "$STORE/es" && mv "$STORE/es.orig" "$STORE/es"
```

Keeping `es.orig` is not only hygiene: swapping between the two is how a round proves
the running instance is the working tree's code, and it is the only honest source of a
`before` screenshot.

## 5. Project probes & quick navigation

Component doc pages are at `/components/<namespace>/<kebab-name>` — `base-ui`
components sit under `/components/base-ui/<name>`. A 404 still returns HTTP 200, so
assert the document title, never the status code.

```bash
agent-browser open "$URL/components/base-ui/floating-panel"
agent-browser eval 'document.title' # "<Name> - Lobe UI" proves the route resolved
```

Geometry probe — the pattern these components are verified with. Measure layout
values, never `getBoundingClientRect` alone: the rect carries in-flight transforms
from entrance animations.

```bash
agent-browser eval 'JSON.stringify({ w: el.offsetWidth, h: el.offsetHeight })'
```

Component demos are ordinary DOM in the page; drive them by accessible name:

```bash
agent-browser eval '(function(){[...document.querySelectorAll("button")]
  .find(b => b.textContent.trim() === LABEL).click(); return 1})()'
```

## 6. Known constraints

- **Node >= 22, pnpm.** The workspace is root + `packages/*`.
- **Aliases point at source.** `docs.config.ts` and `vitest.config.ts` resolve
  `@lobehub/ui` back to `src/`, so a docs-site run proves the source, never the build.
  Only a consuming-app run proves `es/`.
- **A background browser tab freezes rAF and ResizeObserver.** Anything driven by a
  ResizeObserver must be measured in the foreground tab, or through headless
  Playwright.
- **HMR invalidates element refs.** Re-snapshot after a hot reload before interacting.
- **`//` is not a CSS comment.** Inside an `antd-style` css template it parses as
  content, and an apostrophe in the text ends up an unclosed string that fails
  stylelint at commit time. Use `/* */`.
