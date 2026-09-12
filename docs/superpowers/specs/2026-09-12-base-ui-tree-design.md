# base-ui Tree

Data-driven replacement for antd `Tree`, exported from `@lobehub/ui/base-ui`. No compound atoms.

## Scope

In: `treeData`, expand (controlled / default / `defaultExpandAll`), select (single / `multiple`), `checkable` with parent-child linkage (`checkStrictly` opt-out), keyboard navigation, expand/collapse height animation, `showLine`, `showIcon`, custom `switcherIcon`, `blockNode`, `titleRender`, `onRightClick`, per-node `disabled` / `selectable` / `checkable` / `isLeaf`.

Out (not in v1): `draggable`, `virtual` / `height`, `loadData`, `fieldNames`, `filterTreeNode`, `autoExpandParent`, search highlight.

## Files

```
src/base-ui/Tree/
  Tree.tsx          root: state, flatten, keyboard, renders rows
  TreeNode.tsx      one row + Collapsible.Panel for children
  utils.ts          pure helpers: flattenVisible, getAllKeys, conductCheck
  type.ts
  style.ts
  index.ts
  index.mdx
  demos/            basic, checkable, controlled, showLine, contextMenu
  __tests__/
    utils.test.ts
    Tree.test.tsx
```

`src/base-ui/index.ts` gets `export { default as Tree } from './Tree'; export * from './Tree';`.

## Types

```ts
export interface TreeDataNode {
  checkable?: boolean;
  children?: TreeDataNode[];
  disabled?: boolean;
  icon?: ReactNode;
  isLeaf?: boolean;
  key: string;
  selectable?: boolean;
  title: ReactNode;
}

export interface TreeProps {
  blockNode?: boolean;
  checkable?: boolean;
  checkedKeys?: string[];
  checkStrictly?: boolean;
  className?: string;
  classNames?: { indent?: string; node?: string; root?: string; switcher?: string; title?: string };
  defaultCheckedKeys?: string[];
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: string[];
  defaultSelectedKeys?: string[];
  disabled?: boolean;
  expandedKeys?: string[];
  indent?: number;                       // px per depth, default 20
  multiple?: boolean;
  onCheck?: (keys: string[], info: { checked: boolean; node: TreeDataNode }) => void;
  onExpand?: (keys: string[], info: { expanded: boolean; node: TreeDataNode }) => void;
  onRightClick?: (info: { event: MouseEvent; node: TreeDataNode }) => void;
  onSelect?: (keys: string[], info: { node: TreeDataNode; selected: boolean }) => void;
  selectedKeys?: string[];
  showIcon?: boolean;
  showLine?: boolean;
  size?: ControlSize;                    // row height via controlHeight, default 'middle'
  style?: CSSProperties;
  styles?: { ...same slots as classNames };
  switcherIcon?: ReactNode | ((info: { expanded: boolean; node: TreeDataNode }) => ReactNode);
  titleRender?: (node: TreeDataNode) => ReactNode;
  treeData: TreeDataNode[];
}
```

Keys are `string` only. antd's `Key` union is not carried over.

## State

`Tree.tsx` holds three `useControlledState` pairs (`use-merge-value`, already used by `SearchBar`, `HotkeyInput`): `expandedKeys`, `selectedKeys`, `checkedKeys`. All three accept controlled + `default*`, mirroring antd.

Derived once per render with `useMemo`:

- `flat = flattenVisible(treeData, expandedSet)` → `{ node, depth, parentKey, index, hasChildren }[]` in document order. This is the single source of truth for rendering order and keyboard navigation.
- `keyIndex = Map<key, flatIndex>` for O(1) lookup.
- `checkState = checkStrictly ? { checked: Set, halfChecked: ∅ } : conductCheck(treeData, checkedKeys)`.

## Rendering

`Tree` renders `<div role="tree">` and maps `flat` to `TreeNode` rows. Nesting for animation is the only DOM nesting: each parent renders its children inside a `Collapsible.Root open={expanded}` / `Collapsible.Panel`, so the recursion is in `TreeNode`, but the row order and depth still come from `flat` (passed by key lookup, not recomputed).

Row layout, left to right, `paddingInlineStart = depth * indent`:

1. `showLine` guides: absolutely positioned vertical borders per depth, drawn on the row (not on ancestors), so hidden subtrees cost nothing.
2. Switcher: 16px `ActionIcon`-less button; `ChevronRight` rotated 90deg when expanded, `transition: transform 200ms`. Leaf → empty spacer of same width.
3. Checkbox (base-ui `Checkbox`, `indeterminate` from halfChecked) when `checkable && node.checkable !== false`.
4. Icon when `showIcon`.
5. Title: `titleRender?.(node) ?? node.title`. `blockNode` makes the whole row the hit target; otherwise only the title span is.

Row `role="treeitem"`, `aria-expanded` (only when has children), `aria-selected`, `aria-checked` (only when checkable), `aria-level`, `aria-disabled`, `tabIndex` = `0` for the active row else `-1` (roving tabindex).

Height animation: `Collapsible.Panel` sets `--collapsible-panel-height`; style.ts transitions `height 200ms cssVar.motionEaseOut` with `prefers-reduced-motion: reduce` → `0s`, identical to `Accordion/style.ts`. `Collapsible` does the `hidden` toggling after exit; no manual timers.

## Interaction

Click on switcher → toggle expand. Click on title (or row when `blockNode`) → select:

- single: `[key]`, clicking the selected one keeps it selected (antd behaviour without `multiple`).
- `multiple`: plain click → `[key]`; ⌘/ctrl click → toggle; shift click → range over `flat` between anchor and target. Anchor = last plain-clicked key, kept in a ref.

Checkbox change → `conductCheck` toggles the subtree and re-derives ancestors, then `onCheck(checkedKeysWithoutHalf, info)`. `checkStrictly` → toggles that key only.

`onRightClick` on row `contextmenu`. Does not `preventDefault` — caller decides (matches how `TaskSubtasks.tsx` uses it).

Disabled (`props.disabled || node.disabled`): row gets `aria-disabled`, no select/check; expand still allowed (antd parity).

## Keyboard

One `onKeyDown` on the root, operating on `flat` and an `activeKey` state (initial: first selected key, else first row). Focus is moved imperatively via `rowRefs.get(key)?.focus()`.

| Key        | Action                                                                |
| ---------- | --------------------------------------------------------------------- |
| ↓ / ↑      | next / previous row in `flat`                                         |
| Home / End | first / last row                                                      |
| →          | collapsed parent → expand; expanded parent → first child; leaf → noop |
| ←          | expanded parent → collapse; else → move to `parentKey`                |
| Enter      | select active (respects `multiple` + modifiers)                       |
| Space      | `checkable` → toggle check; else same as Enter                        |
| `*`        | expand all siblings of the active row                                 |

Typeahead is out of scope.

## Styling

`style.ts` via `createStyles`. Row height from `controlHeight[size]`. Hover/selected backgrounds use `cssVar.colorFillTertiary` / `cssVar.colorFillSecondary`; focus ring from `base-ui/focusRing.ts`. `showLine` guide colour `cssVar.colorBorderSecondary`. No antd `ConfigProvider` token dependency — the `titleHeight` override lobe-chat does today becomes `size` or `styles.node`.

## Tests

`utils.test.ts`:

- `flattenVisible`: respects expanded set, depth, parentKey, skips hidden subtrees.
- `conductCheck`: check parent → all descendants; uncheck one child → parent half; all children → parent full; disabled / `checkable: false` nodes are skipped and never make a parent half-checked.

`Tree.test.tsx` (RTL + user-event):

- click switcher toggles `aria-expanded` and calls `onExpand`.
- controlled `expandedKeys` does not toggle without the callback updating it.
- ↓ ↓ → ← moves focus as tabled; Space toggles checkbox and `onCheck` receives linked keys.
- `multiple` + shift click yields the range.

## Migration note

`TaskSubtasks.tsx` in lobe-chat: `import { Tree } from '@lobehub/ui/base-ui'`, drop the `ConfigProvider` wrapper, replace `titleHeight: 36` with `size="large"` (or `styles.node`). Props used there (`blockNode defaultExpandAll showLine switcherIcon treeData onRightClick onSelect`) all exist with the same names.
