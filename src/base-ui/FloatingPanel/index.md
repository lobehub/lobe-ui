---
nav: Components
group: Feedback
title: FloatingPanel
description: Viewport-anchored floating panel built from Base UI modal atoms for contextual side conversations, task runs, inspectors, and other non-blocking auxiliary surfaces.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/FloatingPanel/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/FloatingPanel/index.tsx'
---

## Basic

<code src="./demos/index.tsx" nopadding></code>

## Notes

- `FloatingPanel` is resizable by default. The active resize handles follow the
  placement anchor so the panel remains attached to its viewport corner.
- Use `minWidth`, `maxWidth`, `minHeight`, and `maxHeight` to constrain resize
  bounds.
- Use `resizable={false}` for fixed auxiliary panels.
