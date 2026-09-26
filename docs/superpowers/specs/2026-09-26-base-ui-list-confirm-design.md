# base-ui List, and Popconfirm → confirmModal (batch nine)

One new component, `List` in `@lobehub/ui/base-ui`, and one migration with no new component: antd `Popconfirm` → `confirmModal`. Goal: remove every downstream import of antd `Menu`, `List`, `Popconfirm`, and retire the root `@lobehub/ui` `Menu` and `List`.

Downstream numbers come from the 2026-09-26 sweep (lobehub canary `3112b80e`, lobehub-cloud PR #1844 branch, runtime imports only).

## Popconfirm → confirmModal

Downstream: 14 calls in 12 files (oss 6, cloud 6).

- ~10 destructive confirms (remove collaborator, delete API key / dev plugin / skill, remove budget rule / pool, change team URL, reset settings, rerun onboarding)
- 3 payment confirms in cloud (`PlanGrid`, `PaymentButton` ×2): emoji + text title, `icon={false}`
- 1 controlled `open` in `ChatInput/ActionBar/Clear`

`confirmModal` (`@lobehub/ui/base-ui`) already covers every prop in use: `title` / `content` take ReactNode, `okButtonProps` carries `danger` / `disabled`, async `onOk` drives the OK button's loading state and closes on resolve. It is used in 157 downstream files today.

No new component. The interaction changes from a bubble anchored to the trigger to a centered modal. Accepted.

Mapping per call site:

| Popconfirm                                             | confirmModal                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| wrapper around the trigger                             | trigger's `onClick` calls `confirmModal({...})`                    |
| `title`                                                | `title`                                                            |
| `description`                                          | `content`                                                          |
| `okText` / `cancelText`                                | `okText` / `cancelText`                                            |
| `okButtonProps`                                        | `okButtonProps` (`type: 'primary'` dropped, OK is primary already) |
| `onConfirm`                                            | `onOk` (return the promise so loading shows)                       |
| `disabled`                                             | don't call `confirmModal`                                          |
| `open` / `onOpenChange` (ChatInput)                    | deleted; the guard moves into `onClick`                            |
| `placement`, `arrow`, `icon`, `cancelButtonProps.size` | dropped                                                            |

Call sites that also set `loading` on the trigger button (`MemberBudgetControl`, `BudgetPoolControl`) keep it; `onOk` returning the promise covers the modal button.

## List

### Scope

Downstream call sites the component replaces:

| Source                                  | Sites                                                                                                    | Fields used                                                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| antd `Menu` via oss `@/components/Menu` | 3 (`AgentSetting/AgentCategory`, `User/UserPanel/PanelContent`, `(mobile)/community/(list)/_layout/Nav`) | `key`, `icon`, `label`, `extra` ×1, `type: 'divider'` ×3; `selectable`, `selectedKeys`, `onClick({ key })`, `compact` |
| root `@lobehub/ui` `Menu`               | 2 (`DevPanel/RenderGallery/Sidebar`, `community/components/CategoryMenu`)                                | `items`, `mode="inline"`, `selectedKeys`, `onClick({ key })`                                                          |
| root `@lobehub/ui` `List`               | 3 (`ChatGroupWizard` ×2, `MemberSelectionModal`)                                                         | `key`, `title`, `avatar`, `description`, `actions`, `showAction`                                                      |
| antd `List`                             | 2 (`MemberSelectionModal`, `MarketAuth/ClaimResourcesModal`)                                             | `dataSource` + `renderItem`, `bordered`, `size="small"`, `List.Item onClick`                                          |

lobe-ui internal: `src/Burger` renders antd `Menu` inside a `Drawer`; it switches to base-ui `List`.

In: flat items, dividers, icon or avatar, label + description, trailing `extra`, hover `actions`, selection (controlled / uncontrolled), `href` items, danger / disabled items, `compact`, three variants.

Out (not in v1): submenus, groups, `mode="horizontal"`, `inlineCollapsed`, virtual scrolling, drag to reorder, `date` / `pin` / `loading` from the root List, `renderItem`.

### Files

```
src/base-ui/List/
  List.tsx          root: selection state, renders rows and dividers
  ListItem.tsx      one row: button or A, icon/avatar, label, description, extra, actions
  type.ts
  style.ts
  index.ts
  index.mdx
  demos/            navigation, members (avatar + description + actions), outlined, compact
  __tests__/
    List.test.tsx
```

`src/base-ui/index.ts` gets `export { default as List } from './List'; export * from './List';`.

### Types

```ts
export interface ListItemType {
  actions?: ReactNode;
  avatar?: ReactNode;
  className?: string;
  danger?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
  href?: string;
  icon?: IconProps['icon'];
  key: Key;
  label: ReactNode;
  onClick?: (info: ListClickInfo) => void;
  showAction?: boolean;
  style?: CSSProperties;
}

export interface ListDividerType {
  key?: Key;
  type: 'divider';
}

export type ListItem = ListItemType | ListDividerType;

export interface ListClickInfo {
  domEvent: MouseEvent<HTMLElement>;
  item: ListItemType;
  key: Key;
}

export interface ListProps extends Omit<ComponentProps<'ul'>, 'onClick'> {
  activeKey?: Key | null;
  classNames?: {
    actions?: string;
    description?: string;
    extra?: string;
    item?: string;
    label?: string;
  };
  compact?: boolean;
  defaultActiveKey?: Key;
  items: ListItem[];
  onActiveChange?: (key: Key) => void;
  onClick?: (info: ListClickInfo) => void;
  ref?: Ref<HTMLUListElement>;
  selectable?: boolean;
  styles?: {
    actions?: CSSProperties;
    description?: CSSProperties;
    extra?: CSSProperties;
    item?: CSSProperties;
    label?: CSSProperties;
  };
  variant?: 'borderless' | 'filled' | 'outlined';
}
```

- `icon` takes the same Lucide component type as DropdownMenu items, so the downstream item builders (`useMenu`, `useCategory`, `useNav`) keep their shape; only `label` stays `label`.
- Single-select only. `activeKey` replaces antd's `selectedKeys` array; the migration unwraps `[key]` to `key`.

### State

- `selectable` defaults to `false`. When `true`, clicking an item makes it active.
- Controlled when `activeKey` is passed (including `null` for "nothing active"); otherwise internal state seeded from `defaultActiveKey`.
- `onActiveChange(key)` fires on selection change; `onClick` fires on every click, list-level after item-level.
- Clicks on `disabled` items do nothing. Clicks inside `actions` do not select the row or fire `onClick`.

### Rendering

- Markup: `ul[role="list"] > li`. Each item row is a `button type="button"`, or lobe-ui `A` when `href` is set (so `ConfigProvider` `aAs` gives router links). The active item gets `aria-current="true"` (`"page"` when it has `href`).
- Divider items render `li[role="separator"]` containing base-ui `Divider` (batch eight).
- Row layout: leading slot (`avatar` if given, else `Icon` from `icon`), then label with optional description underneath, then `extra` right-aligned. `actions` sit at the trailing edge and replace `extra` while the row is hovered or has focus within; `showAction` keeps them visible.
- Density and visuals match DropdownMenu items (`src/base-ui/DropdownMenu/sharedStyle.ts`): min-height 32px, 12px gap, 16px icon, `borderRadius`. Hover `colorFillTertiary`, active `colorFillSecondary` + `colorText`, danger `colorError`. `compact` drops row gap to 2px and inline padding to 8px. Two-line rows (with `description`) grow in height; description 12px `colorTextDescription`.
- Variants: `borderless` (default, transparent), `filled` (`colorFillQuaternary` container), `outlined` (1px `colorBorderSecondary` container, 4px inner padding) — the outlined variant covers antd List `bordered`.

### Keyboard

Native tab order through the row buttons; Enter / Space activate. No roving tabindex or arrow-key navigation in v1 (these are navigation lists, not `role="menu"`). Focus ring uses the shared `focusRing` helper.

## Tests

`src/base-ui/List/__tests__/List.test.tsx`:

- renders items and dividers; divider has `role="separator"`
- `selectable` + uncontrolled: click sets `aria-current`, fires `onActiveChange`
- controlled `activeKey` does not change without the parent updating it; `activeKey={null}` renders nothing active
- `onClick` receives `{ key, item, domEvent }`; item-level `onClick` fires before list-level
- disabled item: no `onClick`, no selection
- clicks inside `actions` do not select or fire `onClick`
- `href` item renders a link and gets `aria-current="page"` when active
- `avatar` wins over `icon`; `description` renders under the label

## Docs

`index.mdx` (category Navigation) with demos: navigation list (icons, dividers, selectable), member list (avatar, description, hover actions), outlined, compact.

## Downstream migration (after release)

lobehub (canary):

- `src/components/Menu` is deleted; its 3 render sites switch to base-ui `List` with `selectable` + `activeKey`. Of the 5 files that only import `type MenuProps` from it, the item builders `useCategory`, `useMenu`, `useNav` switch to `ListItem[]`; `ResourceManager/.../ViewSwitcher` and `SortDropdown` feed `DropdownMenu` and switch to `DropdownMenuProps['items']`.
- root `Menu` sites (`DevPanel/RenderGallery/Sidebar`, `community/components/CategoryMenu`): import change, `selectedKeys={[k]}` → `activeKey={k}`, drop `mode`.
- root `List` sites (`ChatGroupWizard`, `MemberSelectionModal`): import change, `title` → `label`.
- antd `List` sites: `dataSource.map` → `items`; `bordered` → `variant="outlined"`; `ClaimResourcesModal` checkbox rows put the checkbox in `extra` and toggle in `onClick`.
- Popconfirm: 6 files per the mapping table.

lobehub-cloud (main): Popconfirm 6 files per the mapping table.

## Lint ban (separate PR, after downstream migrates)

- `@lobehub/ui`: add `Menu` and `List` to `DEPRECATED_UI_COMPONENTS`.
- `antd`: ban `Menu`, `List`, `Popconfirm` named imports and `antd/{es,lib}/{menu,list,popconfirm}` paths. `Popconfirm`'s message points to `confirmModal`.

## lobe-ui internal follow-ups

- `src/Burger` switches from antd `Drawer` + `Menu` to base-ui `Drawer` + `List` in the same PR.
- Root `src/Menu` keeps exporting the shared item types (`MenuItemType`, `BaseMenuItemType`, …) that DropdownMenu / ContextMenu depend on; only the antd-rendering `Menu` component becomes deprecated.
- Root `src/List` stays until the ban lands, then is deleted with the other legacy wrappers.
