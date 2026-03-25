---
nav: Components
group: Feedback
title: Modal
description: Base UI-powered Modal with antd-compatible API, supporting declarative, imperative, and atomic usage.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Modal/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Modal/Modal.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Business Scenarios

<code src="./demos/business.tsx" nopadding></code>

## Imperative

<code src="./demos/imperative.tsx" nopadding></code>

## Atom Components

<code src="./demos/atoms.tsx" nopadding></code>

## APIs

### Modal

| Property          | Description                                                                                                                 | Type                                                                              | Default             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------- |
| open              | Whether the modal is visible                                                                                                | `boolean`                                                                         | -                   |
| title             | Modal title. Pass `false` or `null` to hide the header                                                                      | `ReactNode \| false`                                                              | -                   |
| children          | Modal body content                                                                                                          | `ReactNode`                                                                       | -                   |
| onOk              | OK button click callback                                                                                                    | `(e: MouseEvent<HTMLButtonElement>) => void`                                      | -                   |
| onCancel          | Cancel / close callback                                                                                                     | `(e: MouseEvent<HTMLButtonElement>) => void`                                      | -                   |
| okText            | OK button label                                                                                                             | `ReactNode`                                                                       | `'OK'`              |
| cancelText        | Cancel button label                                                                                                         | `ReactNode`                                                                       | `'Cancel'`          |
| okButtonProps     | Extra props for the OK button. Supports `danger` for a destructive style                                                    | `ButtonHTMLAttributes & { danger?: boolean }`                                     | -                   |
| cancelButtonProps | Extra props for the Cancel button                                                                                           | `ButtonHTMLAttributes`                                                            | -                   |
| confirmLoading    | Show a loading spinner inside the OK button                                                                                 | `boolean`                                                                         | `false`             |
| footer            | Custom footer node. Pass `false` or `null` to hide. Pass a render function to keep default buttons alongside custom content | `ReactNode \| false \| null \| ((originNode, { OkBtn, CancelBtn }) => ReactNode)` | Default OK + Cancel |
| width             | Modal panel width                                                                                                           | `string \| number`                                                                | `520`               |
| height            | Modal panel height. Enables a scrollable body when set                                                                      | `string \| number`                                                                | -                   |
| mask              | Show the backdrop overlay                                                                                                   | `boolean`                                                                         | `true`              |
| maskClosable      | Close when clicking the backdrop                                                                                            | `boolean`                                                                         | `true`              |
| keyboard          | Close when pressing Escape                                                                                                  | `boolean`                                                                         | `true`              |
| closable          | Show the built-in close (×) button                                                                                          | `boolean`                                                                         | `true`              |
| closeIcon         | Custom icon for the close button                                                                                            | `ReactNode`                                                                       | `<X size={18} />`   |
| draggable         | Allow the modal to be dragged by the header                                                                                 | `boolean`                                                                         | `true`              |
| allowFullscreen   | Show the fullscreen toggle button in the header                                                                             | `boolean`                                                                         | `false`             |
| loading           | Replace the body with a centered spinner                                                                                    | `boolean`                                                                         | `false`             |
| zIndex            | CSS z-index for the backdrop and popup                                                                                      | `number`                                                                          | `1000`              |
| className         | Extra className applied to the popup panel                                                                                  | `string`                                                                          | -                   |
| style             | Inline style applied to the popup panel                                                                                     | `CSSProperties`                                                                   | -                   |
| classNames        | Semantic classNames for inner elements                                                                                      | `ModalClassNames`                                                                 | -                   |
| styles            | Semantic inline styles for inner elements                                                                                   | `ModalStyles`                                                                     | -                   |
| getContainer      | Mount point for the modal. Pass `false` to render inline                                                                    | `HTMLElement \| false \| null`                                                    | App root            |
| afterClose        | Callback fired after the closing animation finishes                                                                         | `() => void`                                                                      | -                   |
| afterOpenChange   | Callback fired after the open/close animation finishes                                                                      | `(open: boolean) => void`                                                         | -                   |
| centered          | No-op — the modal is always centered                                                                                        | `boolean`                                                                         | `true`              |
| destroyOnHidden   | Destroy the DOM when the modal is hidden                                                                                    | `boolean`                                                                         | `true`              |

### ModalClassNames

| Property | Description                  |
| -------- | ---------------------------- |
| body     | Modal body content area      |
| footer   | Modal footer                 |
| header   | Modal header (title bar)     |
| mask     | Backdrop overlay             |
| title    | Title text inside the header |
| wrapper  | Outer popup viewport wrapper |

### ModalStyles

Same keys as `ModalClassNames`, each accepting a `CSSProperties` value.

---

### createModal

Imperatively open a modal and receive an instance to control it programmatically.

```ts
import { createModal, ModalHost } from '@lobehub/ui/base-ui';

// Render <ModalHost /> once anywhere in your app tree
const instance = createModal({
  title: 'My Modal',
  content: <p>Hello world</p>,
  onOpenChange: (open) => console.log(open),
});

// Later:
instance.close();   // animate out
instance.destroy(); // remove immediately
instance.update({ title: 'Updated Title' });
instance.setCanDismissByClickOutside(false);
```

#### ImperativeModalProps

| Property             | Description                    | Type                      | Default |
| -------------------- | ------------------------------ | ------------------------- | ------- |
| title                | Modal title                    | `ReactNode`               | -       |
| content              | Modal body content             | `ReactNode`               | -       |
| children             | Alias for `content`            | `ReactNode`               | -       |
| footer               | Custom footer                  | `ReactNode`               | -       |
| open                 | Controlled open state          | `boolean`                 | `true`  |
| width                | Modal width                    | `string \| number`        | -       |
| maskClosable         | Close on backdrop click        | `boolean`                 | `true`  |
| classNames           | Semantic classNames            | `BaseModalClassNames`     | -       |
| styles               | Semantic styles                | `BaseModalStyles`         | -       |
| onOpenChange         | Called when open state changes | `(open: boolean) => void` | -       |
| onOpenChangeComplete | Called after exit animation    | `(open: boolean) => void` | -       |

#### ModalInstance

| Method                               | Description                                    |
| ------------------------------------ | ---------------------------------------------- |
| `close()`                            | Trigger the close animation                    |
| `destroy()`                          | Remove the modal immediately without animation |
| `update(props)`                      | Partially update modal props                   |
| `setCanDismissByClickOutside(value)` | Dynamically toggle backdrop-click-to-close     |

---

### confirmModal

Show a pre-built confirmation dialog. Returns `close` and `destroy` handles.

```ts
import { confirmModal, ModalHost } from '@lobehub/ui/base-ui';

// Must render <ModalHost /> somewhere in your app (shared with createModal)
const { close, destroy } = confirmModal({
  title: 'Delete item?',
  content: 'This action cannot be undone.',
  okText: 'Delete',
  okButtonProps: { danger: true },
  onOk: async () => {
    await deleteItem();
  },
  onCancel: () => {},
});
```

| Property      | Description                                                                    | Type                                          | Default    |
| ------------- | ------------------------------------------------------------------------------ | --------------------------------------------- | ---------- |
| title         | Dialog title                                                                   | `ReactNode`                                   | -          |
| content       | Dialog body content                                                            | `ReactNode`                                   | -          |
| okText        | OK button label                                                                | `ReactNode`                                   | `'OK'`     |
| cancelText    | Cancel button label                                                            | `ReactNode`                                   | `'Cancel'` |
| okButtonProps | OK button extra props, supports `danger`                                       | `ButtonHTMLAttributes & { danger?: boolean }` | -          |
| onOk          | OK callback. Async functions keep the button in a loading state until resolved | `() => void \| Promise<void>`                 | -          |
| onCancel      | Cancel callback                                                                | `() => void`                                  | -          |

---

### createModalSystem

Create an isolated modal system with its own stack, separate from the global `createModal` / `confirmModal` / `ModalHost` exports.

```ts
import { createModalSystem } from '@lobehub/ui/base-ui';

const { ModalHost, createModal, confirmModal } = createModalSystem();
```

Useful for micro-frontend setups or Shadow DOM environments where you need namespaced modal instances.

#### ModalHost

| Property | Description                                                                      | Type                                | Default |
| -------- | -------------------------------------------------------------------------------- | ----------------------------------- | ------- |
| root     | Custom mount root for the portal. Defaults to the app element or `document.body` | `HTMLElement \| ShadowRoot \| null` | -       |

---

### Atom Components

The following primitive components are exported for composing custom modal layouts.

| Component          | Description                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `ModalRoot`        | Root dialog controller. Wraps `@base-ui/react` `Dialog.Root` with animated open/close lifecycle |
| `ModalPortal`      | Renders children into the app root element via a portal                                         |
| `ModalViewport`    | Dialog viewport container                                                                       |
| `ModalBackdrop`    | Animated backdrop overlay                                                                       |
| `ModalPopup`       | Animated popup wrapper — handles enter/exit animations and drag constraints                     |
| `ModalHeader`      | Header row container (title + action buttons)                                                   |
| `ModalTitle`       | Accessible dialog title (`Dialog.Title`)                                                        |
| `ModalDescription` | Accessible dialog description (`Dialog.Description`)                                            |
| `ModalContent`     | Scrollable body content area                                                                    |
| `ModalFooter`      | Footer action bar                                                                               |
| `ModalClose`       | Close button with a default × icon                                                              |
| `ModalTrigger`     | Trigger element that opens the modal declaratively                                              |

#### ModalRoot

| Property       | Description                              | Type                                                   | Default |
| -------------- | ---------------------------------------- | ------------------------------------------------------ | ------- |
| open           | Controlled open state                    | `boolean`                                              | -       |
| onOpenChange   | Called when open state changes           | `(open: boolean, details: { reason: string }) => void` | -       |
| onExitComplete | Called after the exit animation finishes | `() => void`                                           | -       |

#### ModalPopup

| Property       | Description                                                                            | Type                  | Default |
| -------------- | -------------------------------------------------------------------------------------- | --------------------- | ------- |
| width          | Max-width of the popup panel                                                           | `string \| number`    | -       |
| style          | Inline style for the inner panel                                                       | `CSSProperties`       | -       |
| popupStyle     | Inline style for the outer `Dialog.Popup` wrapper                                      | `CSSProperties`       | -       |
| panelClassName | Extra className on the inner panel                                                     | `string`              | -       |
| motionProps    | Extra Framer Motion props merged onto the animated panel (e.g. `drag`, `dragControls`) | `Record<string, any>` | -       |

#### ModalTrigger

| Property     | Description                                                                      | Type        | Default |
| ------------ | -------------------------------------------------------------------------------- | ----------- | ------- |
| children     | Trigger content. Pass a React element to use it as the trigger via `render` prop | `ReactNode` | -       |
| nativeButton | Force `nativeButton` mode on the underlying `Dialog.Trigger`                     | `boolean`   | -       |

### Hooks

| Hook                | Description                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `useModalOpen()`    | Returns the current animated open boolean from the nearest `ModalRoot`. Returns `null` outside an animated root     |
| `useModalActions()` | Returns `{ onExitComplete }` action callbacks from the nearest `ModalRoot`. Returns `null` outside an animated root |
| `useModalContext()` | Returns `{ close, setCanDismissByClickOutside }` from the imperative modal context (`ModalContext`)                 |
