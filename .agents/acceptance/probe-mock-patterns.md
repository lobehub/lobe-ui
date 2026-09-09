# probe-mock-patterns.md — @lobehub/ui project layer

How to force state on this product.

## Swap the built package under a consuming app

The only way to prove `es/` rather than `src/`, and the only honest source of a
`before` screenshot. See PROJECT.md §4. Restart the consuming app's dev server
after each swap — bundler caches survive the file replacement.

## Drive a demo by accessible name

Demos are ordinary DOM. Click by trimmed button text rather than a generated
class name:

```bash
agent-browser eval '(function(){[...document.querySelectorAll("button")]
  .find(b => b.textContent.trim() === "Open panel").click(); return 1})()'
```

## Force a viewport-relative branch without resizing the window

`agent-browser` in this environment has no viewport command. Express the case in
viewport-relative CSS instead, so the branch is reached at any window size:
a panel of `calc(100vw - 200px)` leaves a lane too narrow for a toast on every
screen, where a fixed `900px` only does so on a small one.

## Read a component's published custom properties

```bash
agent-browser eval 'getComputedStyle(document.documentElement).getPropertyValue("--toast-shift-x")'
agent-browser eval 'document.querySelector("[role=dialog]").style.getPropertyValue("--floating-panel-reserve-block-end")'
```
