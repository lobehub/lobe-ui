---
name: local-testing
description: >
  Local UI automation testing for the lobe-ui component library. Uses agent-browser CLI
  to drive the dumi dev server (default http://localhost:8000) via Chrome DevTools Protocol —
  navigate to component demo pages, interact with components, capture screenshots, and verify
  rendering. Triggers on 'local test', 'ui test', 'verify component', 'test component',
  'test in browser', 'visual check', 'screenshot demo', or any UI verification task.
---

# Local UI Automation Testing

Use `agent-browser` to drive the dumi dev server and verify component behavior visually and programmatically.

| Layer        | Tool            | Default                 |
| ------------ | --------------- | ----------------------- |
| Dev server   | `dumi dev`      | `http://localhost:8000` |
| Browser auto | `agent-browser` | Chromium via CDP        |

---

## Quick Start

```bash
# 1. Self-start dumi (idempotent — see "Self-orchestrate" below for the full recipe)
curl -fsS http://localhost:8000 > /dev/null \
  || (
    nohup bun run dev > /tmp/lobe-ui-dev.log 2>&1 &
    disown
  )
until curl -fsS http://localhost:8000 > /dev/null 2>&1; do sleep 1; done

# 2. Open an isolated demo (see "Test the demo, not the doc page" below)
agent-browser open http://localhost:8000/~demos/src-html-preview-demo-headresources

# 3. Get interactive element refs
agent-browser snapshot -i

# 4. Interact, then verify
agent-browser click @e1
agent-browser screenshot --full
```

---

## Self-orchestrate: start + analyze without asking

You are expected to run end-to-end without pinging the user for setup. Default flow:

### 1. Probe — is dumi already up?

```bash
# Cheap: HTTP probe. Exits 0 if a server is listening on :8000.
curl -fsS -o /dev/null http://localhost:8000 && echo "up" || echo "down"

# Or: socket probe (works even before the SPA shell is ready)
lsof -nP -iTCP:8000 -sTCP:LISTEN | tail -n +2
```

If `up`, **reuse it** — do not start a second instance.

### 2. Start in background, capture logs

```bash
LOG=/tmp/lobe-ui-dev.log
nohup bun run dev > "$LOG" 2>&1 &
disown
# 'disown' detaches it from this shell so it survives the tool call returning
```

Run this via Bash with `run_in_background: true` if you want the harness to track the PID; otherwise the `disown` form is fine since you'll find it again via `lsof`.

### 3. Wait until ready (and detect the actual port)

dumi auto-bumps to 8001/8002/… when 8000 is taken. **Never assume 8000 worked — read it from the log.**

```bash
# Poll up to 60s for dumi to print its URL
LOG=/tmp/lobe-ui-dev.log
for i in $(seq 1 60); do
  URL=$(grep -Eo 'http://localhost:[0-9]+' "$LOG" | head -1)
  [ -n "$URL" ] && curl -fsS -o /dev/null "$URL" && break
  sleep 1
done
echo "$URL" # e.g. http://localhost:8001
```

Use that `$URL` as the base for every subsequent `agent-browser open` call.

### 4. Discover what demos exist

For a component named `<Foo>`, every isolated demo route is implied by a `<code src="./demos/X.tsx" />` tag in `src/Foo/index.md`:

```bash
# List demo files referenced by a component
grep -oE 'src="\./demos/[^"]+"' src/HtmlPreview/index.md
# → src="./demos/index.tsx"
# → src="./demos/Report.tsx"
# → src="./demos/HeadResources.tsx"

# Convert a path → demo route
demo_route() {
  # $1 = file path relative to repo root, e.g. src/HtmlPreview/demos/HeadResources.tsx
  local path="${1%.*}"     # strip extension
  local dir="${path%/*}"   # directory portion
  local base="${path##*/}" # basename
  # kebab-case the directory (uppercase-after-letter → -lower), lowercase the basename whole
  local dir_kebab
  dir_kebab=$(printf '%s' "$dir" \
    | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' \
    | tr '[:upper:]' '[:lower:]' \
    | sed 's/\//-/g; s/demos$/demo/; s/-demos-/-demo-/g')
  local base_lower
  base_lower=$(printf '%s' "$base" | tr '[:upper:]' '[:lower:]')
  printf '%s-%s\n' "$dir_kebab" "$base_lower"
}
demo_route src/HtmlPreview/demos/HeadResources.tsx
# → src-html-preview-demo-headresources
```

Slug rules (memorize these — dumi's convention):

- Directories are kebab-cased on case boundaries (`HtmlPreview` → `html-preview`).
- The directory literally named `demos` is singularized to `demo`.
- File basename is **lowercased whole** (no internal dashes): `HeadResources` → `headresources`.
- Path separators become `-`.

When in doubt, open the component doc page (`/components/<name>`) and `snapshot -i` — dumi exposes the canonical `/~demos/<id>` link for each embedded demo.

### 5. Install a console-error interceptor before interacting

```bash
agent-browser open "$URL/~demos/src-html-preview-demo-headresources"
agent-browser wait --load networkidle
agent-browser eval --stdin << 'EVALEOF'
(function() {
  window.__CAPTURED_ERRORS = window.__CAPTURED_ERRORS || [];
  var orig = console.error;
  console.error = function() {
    var msg = Array.from(arguments).map(function(a) {
      if (a instanceof Error) return a.stack || a.message;
      return typeof a === 'object' ? JSON.stringify(a) : String(a);
    }).join(' ');
    window.__CAPTURED_ERRORS.push(msg);
    orig.apply(console, arguments);
  };
  window.addEventListener('error', function(e) {
    window.__CAPTURED_ERRORS.push('window.onerror: ' + (e.error && e.error.stack || e.message));
  });
  window.addEventListener('unhandledrejection', function(e) {
    window.__CAPTURED_ERRORS.push('unhandledrejection: ' + (e.reason && e.reason.stack || e.reason));
  });
  return 'installed';
})()
EVALEOF
```

After driving the UI, drain captured errors:

```bash
agent-browser eval "JSON.stringify(window.__CAPTURED_ERRORS || [])"
```

Also tail the dev-server log for SSR / compile errors that never reach the browser:

```bash
tail -n 50 /tmp/lobe-ui-dev.log | grep -iE "error|warn|failed"
```

### 6. Analyze the demo programmatically (don't only screenshot)

Screenshots verify pixels; `eval` verifies semantics. Combine both:

```bash
# Count rendered iframes, sandbox attrs, computed sizes
agent-browser eval --stdin << 'EVALEOF'
JSON.stringify(
  Array.from(document.querySelectorAll('iframe')).map(f => ({
    sandbox: f.getAttribute('sandbox'),
    width: f.clientWidth,
    height: f.clientHeight,
    srcdocLen: (f.srcdoc || '').length,
  }))
)
EVALEOF

# Read into iframe content (only if same-origin or srcdoc-based)
agent-browser eval --stdin << 'EVALEOF'
(function() {
  var f = document.querySelector('iframe');
  if (!f || !f.contentDocument) return 'cross-origin';
  return JSON.stringify({
    title: f.contentDocument.title,
    scripts: f.contentDocument.querySelectorAll('script').length,
    links: f.contentDocument.querySelectorAll('link').length,
  });
})()
EVALEOF
```

### 7. Always re-snapshot after HMR

Editing a `.tsx` file under `src/` triggers HMR; all existing `@eN` refs go stale. After any code change run `agent-browser snapshot -i` before the next interaction.

### 8. Cleanup

Leave the dev server running across iterations — restarting costs ~10s. Only kill it when explicitly done:

```bash
# Find by listening port (handles the auto-bumped 8001/8002 case)
PIDS=$(
  lsof -nP -iTCP:8000 -sTCP:LISTEN -t
  lsof -nP -iTCP:8001 -sTCP:LISTEN -t
)
[ -n "$PIDS" ] && kill $PIDS

# Or by command line
pkill -f "dumi dev" 2> /dev/null
```

Don't `agent-browser close --all` between iterations either — keeping the session warm preserves cookies and avoids cold-start latency.

---

## Test the demo, not the doc page (IMPORTANT)

**Always prefer the isolated demo route `/~demos/<id>` over the full component doc page.** dumi mounts each `<code src="./demos/X.tsx" />` tag as a standalone full-window route — no theme switcher, no sidebar, no other demos stealing focus. This is the right surface for UI verification.

### Deriving the demo route

dumi renders this in `index.md`:

```md
<code src="./demos/HeadResources.tsx" nopadding></code>
```

…which corresponds to file `src/HtmlPreview/demos/HeadResources.tsx`, and produces the route:

```
http://localhost:8000/~demos/src-html-preview-demo-headresources
                              └──────┬─────────────┘ └──────┬──────┘
                                  kebab path             demo name
```

Rules:

- The full file path under the repo root is kebab-cased with `/` and casing collapsed to `-`.
- The segment `demos` is singularized to `demo` (dumi convention).
- File extension is stripped; the basename is lowercased and joined to the rest with `-`.

### How to find demo IDs

```bash
# 1. Grep the component's index.md for <code src="..."> tags — each one is a demo
grep -n "<code src" src/HtmlPreview/index.md
# → 10: <code src="./demos/index.tsx" nopadding></code>
# → 16: <code src="./demos/Report.tsx" nopadding></code>
# → 26: <code src="./demos/HeadResources.tsx" nopadding></code>

# 2. Translate path → route as shown above, then open it
agent-browser open http://localhost:8000/~demos/src-html-preview-demo-report
```

If you're unsure of the exact slug, navigate to the doc page once, run `agent-browser snapshot -i`, and look for the "Open in new tab" / demo link refs — they expose the canonical `/~demos/<id>` URL.

Only fall back to the full doc page (`/components/<name>`) when you need to verify how a component composes with sibling demos or with dumi's chrome itself.

---

## Core Workflow

Every UI verification follows this loop:

1. **Navigate** to the demo page: `agent-browser open http://localhost:8000/components/<name>`
2. **Snapshot** to discover element refs: `agent-browser snapshot -i`
3. **Interact** using `@eN` refs: click, fill, type, select
4. **Re-snapshot** after navigation or DOM mutation — refs are invalidated
5. **Verify** via screenshot (visual) or `eval` (programmatic)

```bash
URL=http://localhost:8000/components/tag
agent-browser open "$URL" && agent-browser wait --load networkidle && agent-browser snapshot -i
# → @e1 button "Default", @e2 button "Primary", ...

agent-browser click @e1
agent-browser screenshot --full
# Read the screenshot with the Read tool to visually verify the result
```

Chain with `&&` when you don't need to inspect intermediate output. Run separately when you need to parse refs out of `snapshot`.

---

## Essential Commands

```bash
# Navigation
agent-browser open <url>                # Navigate (aliases: goto, navigate)
agent-browser close                     # Close current session
agent-browser close --all               # Close all sessions

# Snapshot
agent-browser snapshot -i               # Interactive elements with refs (recommended)
agent-browser snapshot -i -C            # Include contenteditable (rich text inputs)
agent-browser snapshot -s "#root"       # Scope to a CSS selector

# Interaction (use @refs from snapshot)
agent-browser click @e1                 # Click
agent-browser fill @e2 "text"           # Clear + type into <input>/<textarea>
agent-browser type @e2 "text"           # Type without clearing (also works for contenteditable)
agent-browser select @e1 "option"       # Select dropdown
agent-browser check @e1                 # Toggle checkbox
agent-browser press Enter               # Press key
agent-browser scroll down 500           # Scroll page
agent-browser scroll down 500 --selector ".dumi-default-content"  # Scroll within container

# Get information
agent-browser get text @e1
agent-browser get url
agent-browser get title

# Wait
agent-browser wait --load networkidle   # Network idle
agent-browser wait @e1                  # Element appears
agent-browser wait --text "Loaded"      # Text appears
agent-browser wait --url "**/components/**"  # URL matches pattern
agent-browser wait 2000                 # Milliseconds
agent-browser wait "#spinner" --state hidden   # Wait for element to disappear

# Capture
agent-browser screenshot                # Saves to ~/.agent-browser/tmp/screenshots/
agent-browser screenshot --full         # Full page (covers long demo lists)
agent-browser screenshot --annotate     # Numbered overlay + legend mapping numbers → refs

# Viewport (test responsive breakpoints)
agent-browser set viewport 1280 720     # Default
agent-browser set viewport 375  667     # Mobile
agent-browser set viewport 1920 1080 2  # Retina
agent-browser set device "iPhone 14"    # Device emulation (viewport + UA)

# Diff (regression checks)
agent-browser diff snapshot                          # vs last snapshot
agent-browser diff screenshot --baseline before.png  # Pixel diff
```

---

## Recommended Pattern for lobe-ui

```bash
# 0. Make sure dumi is up on :8000
curl -fsS http://localhost:8000 > /dev/null || bun run dev &

# 1. Find the demo file referenced in the component's index.md
grep "<code src" src/HtmlPreview/index.md
# → <code src="./demos/HeadResources.tsx" ...>

# 2. Open the isolated demo route (NOT the doc page)
agent-browser open http://localhost:8000/~demos/src-html-preview-demo-headresources

# 3. Wait for demo to mount, then inspect
agent-browser wait --load networkidle
agent-browser snapshot -i

# 4. Drive the demo, then capture
agent-browser click @e3
agent-browser screenshot --full

# 5. Optional: programmatic assertions on the live demo
agent-browser eval 'document.querySelectorAll("iframe").length'
```

After taking a screenshot, **use the `Read` tool on the returned path** to visually verify the component renders correctly.

---

## Semantic Locators (no ref needed)

```bash
agent-browser find text "Primary" click
agent-browser find role button click --name "Submit"
agent-browser find label "Email" fill "user@test.com"
agent-browser find placeholder "Search" type "query"
agent-browser find testid "tag-demo" click
```

---

## JavaScript Evaluation

```bash
# Simple expression
agent-browser eval 'document.title'

# Complex JS — always use --stdin with heredoc
agent-browser eval --stdin << 'EVALEOF'
JSON.stringify(
  Array.from(document.querySelectorAll('.ant-tag'))
    .map(el => ({ text: el.textContent, color: getComputedStyle(el).color }))
)
EVALEOF
```

Use `eval` to assert computed styles, ARIA attributes, dataset values, or store state without relying on visual diffs.

---

## Annotated Screenshots (Vision Mode)

```bash
agent-browser screenshot --annotate
# Output includes the PNG path and a legend:
#   [1] @e1 button "Default"
#   [2] @e2 button "Primary"
# Read the image with the Read tool, then drive the page using the matching @eN refs.
```

Useful when `snapshot -i` output is too dense to parse — let vision pick the target.

---

## Connect to Existing Chrome

If you'd rather drive your already-open Chrome (handy for inspecting alongside the agent):

```bash
# Launch Chrome with remote debugging once
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/lobe-ui-test-profile \
  "http://localhost:8000" &

agent-browser --auto-connect snapshot -i # auto-discover
# or explicit:
agent-browser --cdp 9222 snapshot -i
```

---

## Viewport & Theme Verification

lobe-ui ships light + dark themes. Verify both:

```bash
# Toggle dumi's theme switch (look for it in the header)
agent-browser snapshot -i | grep -i "theme\|dark\|light"
agent-browser click @eN # the theme toggle ref
agent-browser screenshot --full theme-dark.png

# Toggle back
agent-browser click @eN
agent-browser screenshot --full theme-light.png

# Pixel diff
agent-browser diff screenshot --baseline theme-light.png
```

For responsive checks, set viewport before each screenshot:

```bash
for w in 375 768 1280 1920; do
  agent-browser set viewport $w 800
  agent-browser screenshot --full "responsive-${w}.png"
done
```

---

## Install / Upgrade

```bash
npm i -g agent-browser # or: brew install agent-browser
agent-browser install  # download Chromium
agent-browser upgrade  # update CLI
```

---

## Gotchas

- **Daemon stuck?** `agent-browser close --all` (or `pkill -f agent-browser`) to reset.
- **HMR invalidates refs** — after editing a component, dumi hot-reloads and refs break. Re-snapshot.
- **`snapshot -i` skips contenteditable** — use `snapshot -i -C` for rich-text inputs.
- **`fill` doesn't work on contenteditable** — use `type` instead.
- **Screenshots land in `~/.agent-browser/tmp/screenshots/`** — read them via the `Read` tool to inspect visually.
- **Default command timeout is 25s** — override via `AGENT_BROWSER_DEFAULT_TIMEOUT` (ms) or add explicit `wait`.
- **Shell quoting corrupts `eval`** — always prefer `eval --stdin <<'EVALEOF' … EVALEOF` for non-trivial JS.
- **Port 8000 already in use** — dumi will auto-bump to 8001, 8002… Check the dev-server log and adjust the URL.
- **Dialogs block all commands** — if a command hangs, check `agent-browser dialog status` and `agent-browser dialog accept`/`dismiss`.
