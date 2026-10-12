# Components: v5 / antd props → v6

Tables list only renamed, reshaped or removed props. v6 names are checked against `@lobehub/ui@6.0.0-beta.1` type declarations. Props a v5 wrapper inherited from antd are not in the v5 type files; those rows come from antd v6's public API and are tagged **(antd)**. **(verify)** means check before relying on it.

## Button

https://ui.lobehub.com/components/button

```ts
import { Button, SplitButton } from '@lobehub/ui';
```

| v5 / antd                                                           | v6                                                                                            |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `color` + `variant` (antd) (e.g. `color="danger" variant="filled"`) | not supported. Use `type` (`default \| primary \| dashed \| fill \| link \| text`) + `danger` |
| `ghost` (antd: for dark backgrounds)                                | `ghost` removes the fill and border and keeps the type's color. Different look                |
| `loading={{ delay, icon }}` (antd)                                  | `loading: boolean`                                                                            |
| `iconPlacement` (antd v6) / `iconPosition`                          | `iconPosition: 'start' \| 'end'`                                                              |
| `autoInsertSpace`, `rootClassName` (antd)                           | removed                                                                                       |
| `glass`, `shadow` (v5)                                              | removed                                                                                       |
| `iconProps` (v5)                                                    | removed. Pass `icon={<Icon icon={X} size={…} />}`, or a Lucide component as `icon`            |
| —                                                                   | new: `outdent` (only valid with `type="text"`)                                                |
| `Dropdown.Button` / `Space.Compact` button + menu (antd)            | `<SplitButton><SplitButton.Main /><SplitButton.Menu items={…} /></SplitButton>`               |

Most call sites only need the import changed (see the page's "Migrating from antd's Button").

## Modal

https://ui.lobehub.com/components/modal

```ts
import { Modal, ModalHost, createModal, confirmModal, useModalContext } from '@lobehub/ui';
import type { ModalComponentProps, ImperativeModalProps } from '@lobehub/ui';
```

| v5 / antd                                                                      | v6                                                                                                                                                                                     |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ModalProps` type (v5)                                                         | `ModalComponentProps` (no `ModalProps` export)                                                                                                                                         |
| `destroyOnClose` (antd)                                                        | `destroyOnHidden`                                                                                                                                                                      |
| `getContainer: string \| () => HTMLElement` (antd)                             | `getContainer?: HTMLElement \| false \| null`                                                                                                                                          |
| `classNames.content` / `styles.content` (antd)                                 | `className` / `style` (applied to the panel). Slots: `body`, `footer`, `header`, `mask`, `title`, `wrapper`                                                                            |
| `forceRender`, `modalRender`, `mousePosition`, `focusTriggerAfterClose` (antd) | removed                                                                                                                                                                                |
| `enableResponsive`, `paddings` (v5)                                            | removed                                                                                                                                                                                |
| `Modal.confirm/info/success/warning/error`, `App.useApp().modal` (antd)        | `confirmModal({ title, content, okText, cancelText, okButtonProps, onOk, onCancel, width })`                                                                                           |
| `okType: 'danger'` / `type: 'error'` in confirm (antd)                         | `okButtonProps: { danger: true }`. No `icon`, `centered` or `maskClosable` in `ModalConfirmConfig`                                                                                     |
| v5 `createModal({ children, onOk, onCancel, okText, afterClose, … })`          | `createModal({ title, content, footer, width, maskClosable, onOpenChange, onOpenChangeComplete })`. No `onOk`, `onCancel` or `okText`: build the footer yourself or use `confirmModal` |
| `afterClose` (in `createModal`)                                                | `onOpenChangeComplete(open)`, act when `open === false`                                                                                                                                |
| `createRawModal(Component, props, { openKey, onCloseKey })` (v5)               | removed. Render the component with its own `open` state, or `createModal({ content: <Component /> })` and call `useModalContext().close()` inside                                      |
| `ModalProvider` (v5)                                                           | removed. `useModalContext()` still works inside `createModal` content                                                                                                                  |

`createModal` / `confirmModal` render nothing until `<ModalHost />` is mounted once.

## Select

https://ui.lobehub.com/components/select

```ts
import { Select } from '@lobehub/ui';
import type { SelectOption, SelectOptions } from '@lobehub/ui';
```

| v5 / antd                                                 | v6                                                                                       |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `<Select.Option>` / `<Select.OptGroup>` children (antd)   | `options` (`{ value, label, disabled }` or `{ label, options: [...] }` groups)           |
| `onDropdownVisibleChange` (antd)                          | `onOpenChange(open, eventDetails)`                                                       |
| `dropdownRender` / `popupRender` (antd)                   | no equivalent                                                                            |
| `dropdownStyle`, `classNames.popup.root` (antd)           | `popupClassName` or `classNames.popup` / `classNames.dropdown`                           |
| `filterOption`, `optionFilterProp`, `filterSort` (antd)   | no equivalent. `showSearch` filters options internally                                   |
| `onSearch`, `searchValue` (antd)                          | no equivalent (verify)                                                                   |
| `notFoundContent` (antd)                                  | no equivalent. Style the built-in empty state with `classNames.empty`                    |
| `fieldNames`, `labelInValue` (antd)                       | no equivalent. Map options to `{ value, label }` yourself                                |
| `maxTagCount`, `tagRender`, `menuItemSelectedIcon` (antd) | no equivalent. Use `selectedIndicatorVariant: 'check' \| 'bold'` for the selected marker |
| `getPopupContainer` (antd)                                | no equivalent. Renders into the lobe app element                                         |
| `onClear`, `onDeselect`, `status` (antd)                  | removed                                                                                  |
| `ref: RefSelectProps`                                     | no `ref` prop                                                                            |
| `suffixIcon` (v5: Lucide icon only)                       | `suffixIcon: IconProps['icon'] \| ReactNode`                                             |

## Tabs

https://ui.lobehub.com/components/tabs

```ts
import { Tabs } from '@lobehub/ui';
import type { TabsItem } from '@lobehub/ui';
```

| v5 / antd                                                                  | v6                                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `items[].key` (any)                                                        | `key: string`, required. `onChange(key: string)`                    |
| `tabPosition` / `tabPlacement` (antd)                                      | `orientation: 'horizontal' \| 'vertical'` (left/right → `vertical`) |
| `type="card" \| "editable-card"`, `onEdit`, `hideAdd`, `addIcon` (antd)    | no equivalent. Use `variant: 'rounded' \| 'square' \| 'point'`      |
| `tabBarExtraContent` (antd)                                                | no equivalent. Render it beside `<Tabs>`                            |
| `tabBarStyle` (antd)                                                       | `styles.list` (also `classNames.list`)                              |
| `centered`, `tabBarGutter`, `indicator`, `animated`, `renderTabBar` (antd) | removed                                                             |
| `destroyInactiveTabPane` / `destroyOnHidden`, `items[].forceRender` (antd) | removed                                                             |
| `items[].closable`, `closeIcon` (antd)                                     | removed                                                             |
| `onTabClick`, `onTabScroll` (antd)                                         | removed. Use `onChange`                                             |
| `compact` (v5)                                                             | removed. Use `size="small"` (verify visual parity)                  |
| `<Tabs.TabPane>` (antd)                                                    | `items`                                                             |

## DropdownMenu (antd/v5 `Dropdown`)

https://ui.lobehub.com/components/dropdown-menu

```ts
import { DropdownMenu } from '@lobehub/ui';
import type { DropdownItem, MenuInfo } from '@lobehub/ui';
```

| v5 / antd `Dropdown`                                                        | v6 `DropdownMenu`                                                                        |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `menu={{ items }}`                                                          | `items` (array or `() => DropdownItem[]` for lazy items)                                 |
| `menu={{ onClick: ({ key, domEvent }) => … }}`                              | no menu-level handler. Put `onClick: (info: MenuInfo) => …` on each item                 |
| `menu.selectable` / `selectedKeys` / `multiple`                             | items with `type: 'checkbox'` (or `'switch'`) + `checked` / `onCheckedChange`            |
| `MenuProps['items']`, `ItemType`, `GenericItemType`, `DropdownMenuItemType` | `DropdownItem`                                                                           |
| `trigger={['hover']}` (antd default: hover)                                 | `trigger: 'click' \| 'hover' \| 'both' \| ('hover' \| 'click')[]`, **default `'click'`** |
| `trigger={['contextMenu']}`                                                 | `ContextMenuTrigger`, or `showContextMenu()` + `ContextMenuHost`                         |
| `onOpenChange(open, info)`                                                  | `onOpenChange(open, eventDetails)` (from Base UI `Menu.Root`)                            |
| `overlayClassName` / `overlayStyle` / `classNames.root` (antd)              | `popupProps={{ className, style }}`                                                      |
| `getPopupContainer` (antd)                                                  | `portalProps={{ container }}`                                                            |
| `dropdownRender` / `popupRender` (antd)                                     | `header` / `footer` slots, or the `DropdownMenuRoot` / `DropdownMenuPopup` atoms         |
| `arrow`, `destroyOnHidden`, `forceRender` (antd)                            | removed                                                                                  |
| `autoAdjustOverflow`, `align` (antd)                                        | `positionerProps` (Base UI positioner) (verify)                                          |
| `iconProps` (v5)                                                            | removed                                                                                  |

Item fields `key`, `label`, `icon`, `danger`, `disabled`, `extra`, `type: 'divider' \| 'group'` and submenu `children` keep their shape. New fields: `desc`, `closeOnClick`.

## Input / InputNumber / InputPassword / TextArea / InputOTP

https://ui.lobehub.com/components/input

```ts
import { Input, InputNumber, InputPassword, TextArea, InputOTP } from '@lobehub/ui';
```

| v5 / antd                                                                     | v6                                                                                 |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `ref: InputRef` (`.input`, `.focus({ cursor })`)                              | `ref: HTMLInputElement` (TextArea: `HTMLTextAreaElement`, no `.resizableTextArea`) |
| `addonBefore` / `addonAfter` (antd)                                           | removed. Use `prefix` / `suffix`, or lay out next to the input                     |
| `allowClear={{ clearIcon }}` (antd)                                           | `allowClear: boolean` + `onClear`                                                  |
| `status`, `bordered`, `count` (antd)                                          | removed. Use `variant: 'filled' \| 'outlined' \| 'borderless'`                     |
| `showCount` on `Input` (antd)                                                 | only on `TextArea`, `boolean` (no formatter)                                       |
| `onChange(e)`                                                                 | unchanged (native event), plus `onValueChange(value)` from Base UI                 |
| InputNumber `onChange(value: number \| string \| null)`                       | `onChange(value: number \| null)`                                                  |
| InputNumber `formatter` / `parser` / `stringMode` / `decimalSeparator` (antd) | `format: Intl.NumberFormatOptions` (+ `locale`); `precision` kept                  |
| InputNumber `controls={{ upIcon, downIcon }}`, `keyboard`, `onStep` (antd)    | `controls: boolean`. `keyboard` and `onStep` removed                               |
| InputPassword `visibilityToggle={{ visible, onVisibleChange }}`, `iconRender` | `visibilityToggle: boolean`. `iconRender` removed                                  |
| `InputOPT` (v5) / `Input.OTP` (antd)                                          | `InputOTP`                                                                         |
| OTP `formatter`, `mask: string`, `separator` (antd)                           | `normalizeValue`, `mask: boolean`; `separator` removed                             |
| `Input.Password` / `Input.TextArea` / `Input.Search` (antd)                   | `InputPassword` / `TextArea` / `SearchBar` (verify for Search)                     |

## Tag

https://ui.lobehub.com/components/tag

```ts
import { Tag } from '@lobehub/ui';
```

| v5 / antd                                                  | v6                                                                               |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `bordered={false}` (antd)                                  | `variant="borderless"` (`filled \| outlined \| borderless \| solid`)             |
| `color` preset union                                       | `color?: string` (presets plus `info` / `processing` still recognized)           |
| `onClose(e)` + `e.preventDefault()` to keep the tag (antd) | `onClose` always hides the tag afterwards. Control rendering yourself to keep it |
| `ref: HTMLDivElement` (v5)                                 | `ref: HTMLSpanElement`                                                           |
| `Tag.CheckableTag` (antd)                                  | removed                                                                          |
| `rootClassName` (antd)                                     | `className` / `classNames.root`                                                  |

Otherwise a straight import change (see the page's "Migrating from antd Tag").

## Avatar / AvatarGroup

https://ui.lobehub.com/components/avatar

```ts
import { Avatar, AvatarGroup } from '@lobehub/ui';
```

| v5 / antd                                                 | v6                                                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `src` (antd)                                              | `avatar` (URL, emoji or ReactNode)                                             |
| `icon` / `children` (antd)                                | `avatar={<Icon … />}` or `title` text fallback                                 |
| `size: 'small' \| 'default' \| 'large' \| { xs… }` (antd) | `size: number` (px, default 48)                                                |
| `gap`, `srcSet`, `onError` (antd)                         | removed                                                                        |
| `tooltipProps` (v5)                                       | still typed but **does nothing yet**. Wrap in `<Tooltip>` yourself             |
| `Avatar.Group` + children (antd)                          | `AvatarGroup items={[{ key, avatar, title }]}`                                 |
| `max={{ count, style, popover }}` / `maxCount` (antd)     | `max: number`; count bubble styled through `classNames.count` / `styles.count` |

## Alert

https://ui.lobehub.com/components/alert

```ts
import { Alert } from '@lobehub/ui';
```

| v5 / antd                                         | v6                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `message`                                         | `title` (`message` kept as a deprecated alias)                                                   |
| `variant="filled"`                                | `variant="soft"` (old value is a deprecated alias)                                               |
| `variant="borderless"`                            | `variant="plain"` (old value is a deprecated alias)                                              |
| `classNames.alert` / `styles.alert`               | `classNames.root` / `styles.root`                                                                |
| `closeIcon`, `closeText`, `onClose`, `afterClose` | `closable={{ closeIcon, onClose, afterClose, 'aria-label' }}` (old props deprecated, still work) |
| `ref: AlertRef` (`nativeElement`)                 | `ref: HTMLDivElement`                                                                            |
| `Alert.ErrorBoundary` (antd)                      | removed                                                                                          |

`action`, `banner`, `showIcon`, `description`, `extra`, `extraIsolate` are unchanged.

## Segmented

https://ui.lobehub.com/components/segmented

```ts
import { Segmented } from '@lobehub/ui';
import type { SegmentedOption } from '@lobehub/ui';
```

| v5 / antd                          | v6                                                              |
| ---------------------------------- | --------------------------------------------------------------- |
| `value: string \| number`          | `Value extends string`. Convert numeric values to strings       |
| `orientation="vertical"` (antd v6) | `vertical: boolean`                                             |
| `variant="borderless"` (v5)        | removed: `'filled' \| 'outlined'` only                          |
| `padding` (v5)                     | removed. Use `styles.root` / `styles.item`                      |
| `iconProps` (v5)                   | removed (it was never applied). `options[].icon` is a ReactNode |
| `shape="round"` (antd)             | removed                                                         |
| `rootClassName` (antd)             | `className` / `classNames.root`                                 |

## Drawer

https://ui.lobehub.com/components/drawer

```ts
import { Drawer } from '@lobehub/ui';
```

| v5 / antd                                                   | v6                                                         |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| `size` (antd v6: `'default' \| 'large' \| number`) (verify) | `width` (left/right) / `height` (top/bottom)               |
| `onClose(e)`                                                | `onClose()` (no event argument)                            |
| `destroyOnClose` / `destroyOnHidden`, `forceRender` (antd)  | removed. Content always unmounts on close (Base UI dialog) |
| `getContainer: string \| () => HTMLElement`                 | `getContainer?: HTMLElement \| false \| null`              |
| `classNames.body` / `styles.body`                           | `classNames.content`                                       |
| `classNames.mask`                                           | `classNames.backdrop`                                      |
| `classNames.wrapper` / `classNames.section` (antd)          | `classNames.popup` / `classNames.panel` (verify)           |
| `rootClassName`, `rootStyle` (antd)                         | `className` / `style` (applied to the panel)               |
| `closeIconProps` (v5)                                       | removed. Use `closeIcon` + `classNames.close`              |
| `loading`, `drawerRender`, `resizable`, `autoFocus` (antd)  | removed                                                    |

`push` (`boolean \| { distance }`), `extra`, `footer`, `sidebar`, `noHeader`, `containerMaxWidth` keep their names.

## Collapse → Accordion / Collapsible

https://ui.lobehub.com/components/accordion · https://ui.lobehub.com/components/collapsible

```ts
import { Accordion, Collapsible } from '@lobehub/ui';
import type { AccordionItemType } from '@lobehub/ui';
```

| v5 / antd `Collapse`                                                               | v6 `Accordion`                                                                                  |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `activeKey` / `defaultActiveKey`                                                   | `value` / `defaultValue` (`string[]`)                                                           |
| `onChange(keys)`                                                                   | `onValueChange(value: string[])`                                                                |
| `accordion` (single open)                                                          | `multiple={false}` (default `true`)                                                             |
| `items[].label`                                                                    | `items[].title`                                                                                 |
| `items[].extra`                                                                    | `items[].action` (+ `alwaysShowAction`)                                                         |
| `items[].collapsible="disabled"`, `collapsible` (v5 bool)                          | `items[].disabled`                                                                              |
| `expandIconPosition` / `expandIconPlacement` (antd)                                | `indicatorPlacement: 'start' \| 'end' \| 'inline'`                                              |
| `showArrow={false}` / `expandIcon`                                                 | `hideIndicator` (no custom icon)                                                                |
| `destroyInactivePanel` / `destroyOnHidden`, `items[].forceRender`                  | `keepMounted` (inverse sense, whole accordion)                                                  |
| `ghost` / `bordered`                                                               | `variant: 'borderless' \| 'filled' \| 'outlined'`                                               |
| `items[].desc`, `items[].icon`, `padding`, `classNames.desc` (v5)                  | removed. Put them inside `title`                                                                |
| `<Collapse.Panel>` children (antd)                                                 | `items`, or the `AccordionRoot/Item/Header/Trigger/Panel` atoms                                 |
| v5 legacy `<Accordion expandedKeys onExpandedChange><AccordionItem itemKey title>` | `<Accordion items value onValueChange>`. v6 `AccordionItem` is a Base UI atom, not the old item |
| A single section whose header you render yourself                                  | `<Collapsible open={open} keepMounted?>`                                                        |

## Checkbox / CheckboxGroup

https://ui.lobehub.com/components/checkbox

```ts
import { Checkbox, CheckboxGroup } from '@lobehub/ui';
```

| v5 / antd                                                            | v6                                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `onChange(e)` → `e.target.checked` (antd)                            | `onChange(checked: boolean)` (same as v5)                                       |
| `Checkbox.Group` (antd and v5 static)                                | `CheckboxGroup` named export (no static)                                        |
| Group `options[].value: string \| number` (antd)                     | `value: string` only                                                            |
| Group `onChange(values)`                                             | `onChange(value: string[])`                                                     |
| v5 CheckboxGroup full `FlexboxProps` (`align`, `justify`, `wrap`, …) | only `gap`, `horizontal` + `className` / `style`                                |
| `ref: HTMLDivElement` (v5)                                           | ref of the Base UI `Checkbox.Root` element (verify)                             |
| `textProps` from `TextProps`                                         | `DistributiveOmit<TextProps, 'children' \| 'className' \| 'style'>` (same keys) |

## DatePicker

https://ui.lobehub.com/components/date-picker

```ts
import { DatePicker, DateRangePicker } from '@lobehub/ui';
```

| v5 / antd                                                                            | v6                                                                                         |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `value` / `defaultValue: Dayjs`                                                      | `Date \| null` (`dayjs(v).toDate()`)                                                       |
| `onChange(date: Dayjs, dateString)`                                                  | `onChange(date: Date \| null)`                                                             |
| `picker="month" \| "year"`                                                           | `mode: 'date' \| 'month' \| 'year'`                                                        |
| `picker="week" \| "quarter"`, `showTime`, `TimePicker`                               | no equivalent                                                                              |
| `minDate` / `maxDate`                                                                | `min` / `max` (`Date`)                                                                     |
| `disabledDate(current: Dayjs)`                                                       | `disabledDate(date: Date)`                                                                 |
| `renderExtraFooter`                                                                  | `footer`                                                                                   |
| `showNow`                                                                            | removed (off by default)                                                                   |
| `presets`                                                                            | no equivalent                                                                              |
| `DatePicker.RangePicker`                                                             | `DateRangePicker` (`value: [Date \| null, Date \| null]`, `placeholder: [string, string]`) |
| `open`, `onOpenChange`, `getPopupContainer`, `suffixIcon`, `status`, `inputReadOnly` | removed                                                                                    |

`format` accepts a string or `(date: Date) => string`.

## Skeleton family

https://ui.lobehub.com/components/skeleton

```ts
import { Skeleton } from '@lobehub/ui'; // Skeleton, Skeleton.Text, Skeleton.Avatar
```

| v5 / antd                                                                                        | v6                                                                                                   |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `active`                                                                                         | `animated: boolean \| 'fade' \| 'sweep'`, **default animated** (`'fade'`). antd's sweep is `'sweep'` |
| `<Skeleton loading={l}>{children}</Skeleton>` (antd)                                             | no children. `l ? <Skeleton … /> : children`                                                         |
| `<Skeleton avatar title paragraph={{ rows }} />`                                                 | compose `Skeleton.Avatar` + `Skeleton.Text rows={n}`                                                 |
| `Skeleton.Block` (v5)                                                                            | `<Skeleton width height />`                                                                          |
| `Skeleton.Button` / `Skeleton.Input` / `Skeleton.Image` / `Skeleton.Node`                        | `<Skeleton width height radius />`                                                                   |
| `Skeleton.Paragraph rows` / `Skeleton.Title` (v5)                                                | `Skeleton.Text rows fontSize width`                                                                  |
| `Skeleton.Tags count` (v5)                                                                       | several `<Skeleton />` in a `Flexbox horizontal`                                                     |
| `round` (antd)                                                                                   | `radius`                                                                                             |
| `Skeleton.Avatar size="small" \| "large"`, default circle                                        | `size: number \| string` (default 40), **default `shape="square"`**                                  |
| `SkeletonBlock`/`SkeletonButton`/`SkeletonParagraph`/`SkeletonTags`/`SkeletonTitle` exports (v5) | removed. Use `Skeleton`, `SkeletonText`, `SkeletonAvatar`                                            |

## Text

https://ui.lobehub.com/components/text

```ts
import { Text } from '@lobehub/ui';
```

| v5 / antd `Typography`                                  | v6                                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| `Typography.Text` (renders `<span>`)                    | `Text` renders `<div>` by default. Use `as="span"` inline              |
| `Typography.Paragraph` / `Typography.Title level={n}`   | `<Text as="p">` / `<Text as="h2" fontSize… weight…>`                   |
| `Typography.Link`                                       | `A` component, or `<Text as="a">`                                      |
| `copyable`                                              | removed. Use `CopyButton` next to it                                   |
| `editable`                                              | removed. Use `EditableText`                                            |
| `ellipsis={{ expandable, suffix, onEllipsis, symbol }}` | removed. `ellipsis: boolean \| { rows, tooltip, tooltipWhenOverflow }` |
| `keyboard`                                              | removed (use `Hotkey`)                                                 |
| —                                                       | new: `classNames.root` / `styles.root`, `shiny` + `shinyDuration`      |

v5 → v6 `Text` props are otherwise identical.

## ActionIcon

https://ui.lobehub.com/components/action-icon

```ts
import { ActionIcon } from '@lobehub/ui';
```

| v5                           | v6                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| renders a `<div>` (`Center`) | renders a native `<button type="button">`. Don't nest it inside another `<button>` / `<a>` |
| `ref: HTMLDivElement`        | `ref: HTMLButtonElement`                                                                   |
| `onClick` etc. typed for div | button event types                                                                         |
| —                            | `classNames` / `styles` (`root`, `icon`)                                                   |
| —                            | `outdent` (only valid with `variant="borderless"`)                                         |

`title`, `tooltipProps`, `size`, `variant`, `active`, `danger`, `loading`, `spin`, `glass`, `shadow` are unchanged.

## DraggablePanel

https://ui.lobehub.com/components/draggable-panel

```ts
import { DraggablePanel, DraggablePanelBody, DraggablePanelHeader } from '@lobehub/ui';
```

| v5                                                                                           | v6                                                                                         |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `placement` required                                                                         | optional, default `'right'`; `left`/`right` follow `dir="rtl"`                             |
| `size` / `defaultSize: Partial<re-resizable Size>`                                           | `DraggablePanelSize { width?, height? }`                                                   |
| `onSizeChange(delta: NumberSize, size?)` / `onSizeDragging`                                  | `(delta: DraggablePanelSize, size: DraggablePanelSize)`. `size` is always passed           |
| `resize` (react-rnd `enableResizing` map)                                                    | removed                                                                                    |
| `pin`, `fullscreen`, `headerHeight`, `destroyOnClose`, `stableLayout`, `showHandleHighlight` | removed                                                                                    |
| `classNames.handle` / `styles.handle`                                                        | removed. Use the `DraggablePanelHandle` atom for a custom handle                           |
| `DraggablePanel.Body/Header/Footer/Container` statics                                        | removed. Use the named exports `DraggablePanelBody` / `…Header` / `…Footer` / `…Container` |
| —                                                                                            | atoms: `DraggablePanelRoot`, `…Content`, `…Handle`, `…Toggle`, `useDraggablePanelContext`  |

## List

https://ui.lobehub.com/components/list

```ts
import { List } from '@lobehub/ui';
import type { ListItemType, ListClickInfo } from '@lobehub/ui';
```

| v5 root `List` / antd                                           | v6                                                                                                |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `items[].title` (v5)                                            | `items[].label`                                                                                   |
| `List.Item` / `ListItem` component (v5)                         | removed. `ListItem` is now the **item union type**. Copy the old row into your app if you need it |
| `items[].active` (v5)                                           | `activeKey` / `defaultActiveKey` + `onActiveChange`                                               |
| `items[].date`, `pin`, `loading`, `addon`, `onHoverChange` (v5) | removed                                                                                           |
| `onClick({ item, key })`                                        | `onClick({ domEvent, item, key })`; also per-item `onClick`                                       |
| `classNames.title/desc/container/content/date/pin` (v5)         | `classNames.label/description/item/actions/extra`                                                 |
| `ref: HTMLDivElement`, `FlexboxProps` (v5)                      | `ref: HTMLUListElement`, `<ul>` props                                                             |
| antd `List dataSource` + `renderItem`                           | `items`                                                                                           |
| antd `List bordered`                                            | `variant="outlined"`                                                                              |
| antd `Menu selectedKeys={[k]}` + `mode`                         | `activeKey={k}`, no `mode`                                                                        |
| antd `Menu` submenus/groups, virtual lists                      | not supported                                                                                     |

## Form (`@lobehub/ui/form`)

https://ui.lobehub.com/components/form-kit

```ts
import { Form, useForm, useWatch } from '@lobehub/ui/form';
```

The root `Form` from `@lobehub/ui` in v6 is a deprecated uncontrolled form with no rules. Migrate to `@lobehub/ui/form`.

| antd / v5 root `Form`                                                                 | `@lobehub/ui/form`                                                                            |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `const [form] = Form.useForm()` + `<Form form initialValues onFinish onValuesChange>` | `const form = useForm<V>({ initialValues, onSubmit, onValuesChange })` + `<Form form={form}>` |
| `ref: FormInstance` (v5)                                                              | the `form` prop; `ref` is the `HTMLFormElement`                                               |
| `Form.Item` / `FormItem` (v5)                                                         | `Form.Field` / `FormField`                                                                    |
| `rules={[{ required: true }]}`                                                        | `required` (`boolean \| string`)                                                              |
| `rules={[{ validator }]}`                                                             | `validate={async (value, values) => message \| undefined}` (or a Standard Schema)             |
| `rules={[{ type: 'email' }]}`                                                         | schema: `useForm({ schema: z.object({ email: z.string().email() }) })`                        |
| `valuePropName="checked"` / `getValueFromEvent`                                       | `valueProp` (lobe controls are handled) / `getValue`                                          |
| `noStyle` / `dependencies` / `shouldUpdate`                                           | `bare` / `deps` / `useWatch` + conditional render                                             |
| `form.setFieldsValue(v)` / `setFields([{ name, errors }])`                            | `form.setValues(v)` / `form.setErrors({ [name]: msg })`                                       |
| `form.validateFields()`                                                               | `await form.validate()` → check `valid`                                                       |
| `form.getFieldsValue()`                                                               | `form.getValues()` — **the whole store**, not just mounted fields                             |
| `Form.useWatch('a', form)` / `Form.Provider`                                          | `useWatch(form, 'a')` / `form.subscribe(selector, cb)`                                        |
| `itemVariant` (v5)                                                                    | removed. Use `variant` on `Form` / `Form.Field`                                               |

## AutoComplete

https://ui.lobehub.com/components/auto-complete

```ts
import { AutoComplete } from '@lobehub/ui';
```

| antd                                                             | v6                                                                   |
| ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| `onSelect(value, option)`                                        | no equivalent. `onChange(value)` also fires when an item is picked   |
| `onSearch`                                                       | still exists; fires together with `onChange`                         |
| `filterOption`                                                   | `filter` (Base UI `Autocomplete.Root`, passed through) (verify)      |
| `notFoundContent`                                                | `emptyText`                                                          |
| `options[].options` (groups)                                     | not supported. `options: (string \| { value, label?, disabled? })[]` |
| custom input child (`<AutoComplete><TextArea /></AutoComplete>`) | not supported                                                        |
| `dropdownRender` / `popupRender`, `getPopupContainer`            | removed                                                              |
| `popupClassName` / `classNames.popup.root`                       | `classNames.popup` / `styles.popup`                                  |
| `defaultActiveFirstOption`                                       | `autoHighlight` (Base UI) (verify)                                   |
| `onDropdownVisibleChange`                                        | `onOpenChange(open, eventDetails)` (Base UI)                         |
| `allowClear={{ clearIcon }}`, `status`                           | `allowClear: boolean`. `status` removed                              |

## Tooltip

https://ui.lobehub.com/components/tooltip

```ts
import { Tooltip, TooltipGroup } from '@lobehub/ui';
```

v5 `Tooltip` already used Base UI, so v5 call sites keep working. From antd:

| antd                                                                                  | v6                                                               |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `arrow` (default on) / `arrow={{ pointAtCenter }}`                                    | `arrow: boolean`, **default `false`**                            |
| `trigger="click" \| "focus" \| "contextMenu"`                                         | no `trigger` prop (hover/focus only). Use `Popover` for click    |
| `overlayClassName` / `classNames.root`                                                | `className` or `classNames.root`                                 |
| `overlayStyle` / `overlayInnerStyle`                                                  | `styles.root` / `styles.content`                                 |
| `getPopupContainer`                                                                   | still works but deprecated. Prefer `popupContainer: HTMLElement` |
| `color`, `fresh`, `destroyOnHidden`, `autoAdjustOverflow`, `align`, `afterOpenChange` | removed (positioning via `positionerProps`)                      |
| `mouseEnterDelay` / `mouseLeaveDelay` (seconds)                                       | kept; `openDelay` / `closeDelay` (ms) take precedence            |
| —                                                                                     | new: `hotkey`, `hotkeyProps`, `standalone`, `TooltipGroup`       |

## Popover

https://ui.lobehub.com/components/popover

```ts
import { Popover } from '@lobehub/ui';
```

v5 `Popover` already used Base UI. From antd:

| antd                                                      | v6                                                                         |
| --------------------------------------------------------- | -------------------------------------------------------------------------- |
| `title`                                                   | removed. Put the heading inside `content`                                  |
| `arrow` (default on)                                      | `arrow: boolean`, **default `false`**                                      |
| `trigger="focus" \| "contextMenu"`                        | `trigger: 'hover' \| 'click' \| 'both' \| array`, default `'hover'`        |
| `overlayClassName` / `overlayInnerStyle`                  | `className` or `classNames.root` / `styles.content`                        |
| `getPopupContainer`                                       | kept (there is no `popupContainer` prop on Popover)                        |
| `fresh`, `destroyOnHidden`, `autoAdjustOverflow`, `align` | removed (`positionerProps`, `portalProps`, `popupProps` for Base UI parts) |
| —                                                         | new: `standalone`, `nativeButton`, `backdropProps`, `PopoverGroup`         |

## Common pitfalls

- **`DropdownItem` breaks contextual typing.** `onClick: ({ domEvent }) => …` inside a `DropdownItem[]` literal loses its parameter type, because the type is a union of item shapes. Annotate it: `onClick: (info: MenuInfo) => …`, importing `MenuInfo` from `@lobehub/ui`. Replace `MenuProps['items']` / `ItemType` / `GenericItemType` with `DropdownItem`.
- **No menu-level `onClick`.** A `switch (key)` in `menu.onClick` has to move into each item's `onClick`.
- **DropdownMenu opens on click by default** (antd Dropdown opened on hover). Pass `trigger="hover"` where hover is intended.
- **Portal lookups.** `document.querySelector('.ant-app')` and `getPopupContainer={() => …ant-app}` find nothing. Use `document.getElementById(LOBE_THEME_APP_ID)` or `useAppElement()` (both from `@lobehub/ui`).
- **Forms return the whole store.** `getValues()`, `onSubmit(values)` and the second argument of `onValuesChange` include every key from `initialValues`, `setValues` and hidden or conditional fields. antd returned only mounted `Form.Item`s. Pick the fields you submit explicitly; never post a DB row back unchanged.
- **Mount `<ModalHost />` once**, or nothing shows for `createModal` / `confirmModal`. `createRawModal` and `ModalProvider` are gone.
- **Removed types:** `ModalProps` → `ModalComponentProps`; `DropdownProps` → `DropdownMenuProps`. antd types (`ButtonProps` from `antd`, `InputRef`, `FormInstance` from `antd`) must be replaced with the `@lobehub/ui` types or DOM element types.
- **Callback arguments changed:** Checkbox `onChange(checked)`, InputNumber `onChange(number | null)`, Drawer `onClose()`, DatePicker `Date` instead of `Dayjs`, Tabs/Accordion keys are `string`.
- **Refs are plain DOM elements.** `.input`, `.nativeElement`, `.resizableTextArea` and `focus({ cursor })` no longer exist.
- **Reused names mean different things:** v6 `AccordionItem` is a Base UI atom (not the v5 item with `itemKey`); v6 `ListItem` is a type, not a component.
- **Compound statics are gone:** `Select.Option`, `Tabs.TabPane`, `Collapse.Panel`, `Checkbox.Group`, `Avatar.Group`, `Input.Password`, `DatePicker.RangePicker`, `Modal.confirm`. Use `options` / `items` or the named exports.
- **Defaults that changed the look:** Tooltip/Popover `arrow` defaults to `false`; Skeleton animates by default and `Skeleton.Avatar` is square; `Text` renders a block `<div>`; Button `ghost` is no longer the on-dark variant.
- **Things that type-check but do nothing:** Avatar `tooltipProps`; Tag `onClose` + `preventDefault()` no longer keeps the tag.
