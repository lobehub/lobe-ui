---
nav: Components
group: General
title: Freeze
---

Freeze prevents DOM updates in its children by leveraging React's Suspense mechanism. This is useful for exit animations — keeping content visually frozen while animations play out.

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property | Description                                  | Type        | Default |
| -------- | -------------------------------------------- | ----------- | ------- |
| frozen   | Whether to freeze the children's DOM updates | `boolean`   | -       |
| children | Content to be frozen                         | `ReactNode` | -       |

> Note: This implementation is a stable fallback for React 19.1+ and does not rely on canary Fragment ref APIs. It snapshots inline `display` values before freezing and only restores nodes that Suspense changed to `display: none`, so pre-existing hidden styles are preserved.
