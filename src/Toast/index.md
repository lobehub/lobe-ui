---
nav: Components
group: Feedback
title: Toast
description: A toast notification component for displaying brief messages.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Promise

<code src="./demos/promise.tsx" nopadding></code>

## Position

<code src="./demos/position.tsx" nopadding></code>

## Usage

### Basic Usage

```tsx | pure
import { ToastHost, toast } from '@lobehub/ui';

// Add ToastHost to your app (only once)
function App() {
  return (
    <>
      <ToastHost />
      <YourApp />
    </>
  );
}

// Use toast anywhere in your app
toast.success('Operation successful!');
toast.error('Something went wrong!');
toast.info('Here is some information.');
toast.warning('This is a warning!');
toast.loading('Loading...');

// Custom toast
toast({
  title: 'Custom Toast',
  description: 'This is a custom toast message.',
  type: 'info',
  duration: 3000,
});
```

### Promise Toast

```tsx | pure
import { toast } from '@lobehub/ui';

// Show loading toast while promise is pending
toast.promise(fetchData(), {
  loading: 'Loading data...',
  success: (data) => `Data: ${data}`,
  error: (err) => `Error: ${err.message}`,
});
```

### Dismiss Toast

```tsx | pure
import { toast } from '@lobehub/ui';

// Dismiss a specific toast
const { id } = toast.success('Message');
toast.dismiss(id);

// Dismiss all toasts
toast.dismiss();
```

## API

### ToastHost

| Property       | Description                | Type                                                | Default             |
| -------------- | -------------------------- | --------------------------------------------------- | ------------------- |
| position       | Toast position             | `ToastPosition`                                     | `'bottom-right'`    |
| duration       | Default duration in ms     | `number`                                            | `5000`              |
| limit          | Maximum number of toasts   | `number`                                            | `5`                 |
| swipeDirection | Swipe direction to dismiss | `'left' \| 'right' \| 'up' \| 'down' \| Array<...>` | `['down', 'right']` |
| root           | Portal container           | `HTMLElement \| ShadowRoot \| null`                 | -                   |
| className      | Additional class name      | `string`                                            | -                   |

### toast

| Method          | Description                        | Type                                                 |
| --------------- | ---------------------------------- | ---------------------------------------------------- |
| toast()         | Show a default toast               | `(options: ToastOptions) => ToastInstance`           |
| toast.success() | Show a success toast               | `(options: ToastOptions \| string) => ToastInstance` |
| toast.error()   | Show an error toast                | `(options: ToastOptions \| string) => ToastInstance` |
| toast.info()    | Show an info toast                 | `(options: ToastOptions \| string) => ToastInstance` |
| toast.warning() | Show a warning toast               | `(options: ToastOptions \| string) => ToastInstance` |
| toast.loading() | Show a loading toast               | `(options: ToastOptions \| string) => ToastInstance` |
| toast.promise() | Show a toast for promise lifecycle | `<T>(promise: Promise<T>, options) => Promise<T>`    |
| toast.dismiss() | Dismiss toasts                     | `(id?: string) => void`                              |

### ToastOptions

| Property    | Description                                | Type                | Default     |
| ----------- | ------------------------------------------ | ------------------- | ----------- |
| title       | Toast title                                | `ReactNode`         | -           |
| description | Toast description                          | `ReactNode`         | -           |
| type        | Toast type                                 | `ToastType`         | `'default'` |
| duration    | Duration in ms                             | `number`            | `5000`      |
| closable    | Whether closable                           | `boolean`           | `true`      |
| icon        | Custom icon                                | `IconProps['icon']` | -           |
| placement   | Toast placement, overrides global position | `ToastPosition`     | -           |
| onClose     | Callback when closed                       | `() => void`        | -           |
| onRemove    | Callback when removed                      | `() => void`        | -           |
| actionProps | Action button props                        | `ButtonProps`       | -           |

### ToastPosition

```ts | pure
type ToastPosition = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';
```

### ToastType

```ts | pure
type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading' | 'default';
```
