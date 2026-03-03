# Base UI Modal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a base-ui Modal component with declarative atoms and imperative API, built on `@base-ui/react/dialog`, Vercel-style design.

**Architecture:** Two-layer split — `src/base-ui/Modal/` provides headless atoms wrapping `@base-ui/react/dialog` with Vercel-style defaults plus a global-stack imperative API (`createModal`/`ModalHost`). Upper antd-compat layer in `src/Modal/` is a future refactor.

**Tech Stack:** `@base-ui/react/dialog`, `antd-style` (`createStaticStyles`, `cx`, `cssVar`), `class-variance-authority`, `lucide-react`

---

### Task 1: Create type definitions

**Files:**

- Create: `src/base-ui/Modal/type.ts`

**Step 1: Write types**

```ts
import type { CSSProperties, ReactNode } from 'react';

export interface BaseModalProps {
  children?: ReactNode;
  className?: string;
  classNames?: {
    backdrop?: string;
    close?: string;
    content?: string;
    footer?: string;
    header?: string;
    popup?: string;
    title?: string;
  };
  maskClosable?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  open?: boolean;
  styles?: {
    backdrop?: CSSProperties;
    close?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
    header?: CSSProperties;
    popup?: CSSProperties;
    title?: CSSProperties;
  };
  title?: ReactNode;
  width?: number | string;
}

export interface ModalContextValue {
  close: () => void;
  setCanDismissByClickOutside: (value: boolean) => void;
}

export interface ModalInstance extends ModalContextValue {
  destroy: () => void;
  update: (nextProps: Partial<BaseModalProps>) => void;
}

export type ImperativeModalProps = BaseModalProps & {
  content?: ReactNode;
};
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit src/base-ui/Modal/type.ts` (or rely on IDE)

---

### Task 2: Create context

**Files:**

- Create: `src/base-ui/Modal/context.ts`

**Step 1: Write context**

Follow the pattern from `src/base-ui/Toast/context.ts` and `src/Modal/ModalProvider.tsx`.

```ts
'use client';

import { createContext, use } from 'react';

import type { ModalContextValue } from './type';

export const ModalContext = createContext<ModalContextValue>({
  close: () => undefined,
  setCanDismissByClickOutside: () => undefined,
});

export const useModalContext = () => use(ModalContext);
```

---

### Task 3: Create styles

**Files:**

- Create: `src/base-ui/Modal/style.ts`

**Step 1: Write Vercel-style modal styles**

Follow the pattern from `src/base-ui/Toast/style.ts` — use `createStaticStyles` with `cssVar` tokens. Use `[data-starting-style]` / `[data-ending-style]` for CSS-based transitions (same pattern as base-ui dialog).

```ts
import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  backdrop: css`
    position: fixed;
    inset: 0;
    z-index: 1000;

    background: rgb(0 0 0 / 50%);
    backdrop-filter: blur(4px);

    transition: opacity 150ms ease-out;

    &[data-starting-style],
    &[data-ending-style] {
      opacity: 0;
    }
  `,

  close: css`
    cursor: pointer;

    position: absolute;
    inset-block-start: 12px;
    inset-inline-end: 12px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: ${cssVar.borderRadiusSM};

    color: ${cssVar.colorTextTertiary};

    background: transparent;

    transition: all 150ms ease-out;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }
  `,

  content: css`
    overflow: hidden auto;
    padding: 16px 24px;
  `,

  footer: css`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;

    padding: 16px 24px;
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
  `,

  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 16px 24px;
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
  `,

  popup: css`
    position: fixed;
    inset: 0;
    z-index: 1001;

    display: flex;
    align-items: center;
    justify-content: center;

    pointer-events: none;
  `,

  popupInner: css`
    pointer-events: auto;

    position: relative;

    box-sizing: border-box;
    width: calc(100% - 32px);
    max-width: 520px;
    max-height: calc(100dvh - 64px);
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 12px;

    background: ${cssVar.colorBgContainer};
    box-shadow:
      0 0 0 1px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent),
      0 1px 1px -0.5px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent),
      0 3px 3px -1.5px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent),
      0 6px 6px -3px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent),
      0 12px 12px -6px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent),
      0 24px 24px -12px color-mix(in srgb, ${cssVar.colorBgSolid} 3%, transparent);

    transition:
      transform 150ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 150ms ease-out;

    &[data-starting-style],
    &[data-ending-style] {
      opacity: 0;
      transform: scale(0.96) translateY(4px);
    }
  `,

  title: css`
    margin: 0;

    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    color: ${cssVar.colorText};
  `,

  viewport: css`
    position: fixed;
    inset: 0;
    z-index: 1000;

    overflow: auto;
  `,
}));
```

---

### Task 4: Create atom components

**Files:**

- Create: `src/base-ui/Modal/atoms.tsx`

**Step 1: Write atom components**

Follow the pattern from `src/base-ui/DropdownMenu/atoms.tsx` — thin wrappers with style merging.

```tsx
'use client';

import { Dialog } from '@base-ui/react/dialog';
import { cx } from 'antd-style';
import { X } from 'lucide-react';
import type React from 'react';
import { forwardRef } from 'react';

import { useAppElement } from '@/ThemeProvider';

import { styles } from './style';

// --- Root ---
export type ModalRootProps = Dialog.Root.Props;
export const ModalRoot = (props: ModalRootProps) => <Dialog.Root modal {...props} />;
ModalRoot.displayName = 'ModalRoot';

// --- Portal ---
export type ModalPortalProps = React.ComponentProps<typeof Dialog.Portal> & {
  container?: HTMLElement | null;
};
export const ModalPortal = ({ container, ...rest }: ModalPortalProps) => {
  const appElement = useAppElement();
  return <Dialog.Portal container={container ?? appElement ?? undefined} {...rest} />;
};
ModalPortal.displayName = 'ModalPortal';

// --- Viewport ---
export type ModalViewportProps = React.ComponentPropsWithRef<typeof Dialog.Viewport>;
export const ModalViewport = forwardRef<HTMLDivElement, ModalViewportProps>(
  ({ className, ...rest }, ref) => (
    <Dialog.Viewport ref={ref} {...rest} className={cx(styles.viewport, className)} />
  ),
);
ModalViewport.displayName = 'ModalViewport';

// --- Backdrop ---
export type ModalBackdropProps = React.ComponentPropsWithRef<typeof Dialog.Backdrop>;
export const ModalBackdrop = forwardRef<HTMLDivElement, ModalBackdropProps>(
  ({ className, ...rest }, ref) => (
    <Dialog.Backdrop ref={ref} {...rest} className={cx(styles.backdrop, className)} />
  ),
);
ModalBackdrop.displayName = 'ModalBackdrop';

// --- Popup (outer positioning wrapper) ---
export type ModalPopupProps = React.ComponentPropsWithRef<typeof Dialog.Popup> & {
  width?: number | string;
};
export const ModalPopup = forwardRef<HTMLDivElement, ModalPopupProps>(
  ({ className, children, width, style, ...rest }, ref) => (
    <Dialog.Popup ref={ref} {...rest} className={cx(styles.popup, className)}>
      <div className={styles.popupInner} style={{ maxWidth: width ?? undefined, ...style }}>
        {children}
      </div>
    </Dialog.Popup>
  ),
);
ModalPopup.displayName = 'ModalPopup';

// --- Header ---
export type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} {...rest} className={cx(styles.header, className)} />
  ),
);
ModalHeader.displayName = 'ModalHeader';

// --- Title ---
export type ModalTitleProps = React.ComponentPropsWithRef<typeof Dialog.Title>;
export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, ...rest }, ref) => (
    <Dialog.Title ref={ref} {...rest} className={cx(styles.title, className)} />
  ),
);
ModalTitle.displayName = 'ModalTitle';

// --- Description ---
export type ModalDescriptionProps = React.ComponentPropsWithRef<typeof Dialog.Description>;
export const ModalDescription = Dialog.Description;
ModalDescription.displayName = 'ModalDescription';

// --- Content ---
export type ModalContentProps = React.HTMLAttributes<HTMLDivElement>;
export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} {...rest} className={cx(styles.content, className)} />
  ),
);
ModalContent.displayName = 'ModalContent';

// --- Footer ---
export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;
export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} {...rest} className={cx(styles.footer, className)} />
  ),
);
ModalFooter.displayName = 'ModalFooter';

// --- Close ---
export type ModalCloseProps = React.ComponentPropsWithRef<typeof Dialog.Close>;
export const ModalClose = forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ className, children, ...rest }, ref) => (
    <Dialog.Close ref={ref} {...rest} className={cx(styles.close, className)}>
      {children ?? <X size={18} />}
    </Dialog.Close>
  ),
);
ModalClose.displayName = 'ModalClose';

// --- Trigger ---
export type ModalTriggerProps = React.ComponentPropsWithRef<typeof Dialog.Trigger>;
export const ModalTrigger = Dialog.Trigger;
ModalTrigger.displayName = 'ModalTrigger';
```

---

### Task 5: Create imperative API

**Files:**

- Create: `src/base-ui/Modal/imperative.tsx`

**Step 1: Write imperative API**

Follow the global stack pattern from `src/Modal/imperative.tsx` and `src/base-ui/Toast/imperative.tsx`. The rendering uses the atom components instead of antd Modal.

```tsx
'use client';

import type { ReactNode } from 'react';
import { memo, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { useIsClient } from '@/hooks/useIsClient';
import { useAppElement } from '@/ThemeProvider';
import { registerDevSingleton } from '@/utils/devSingleton';

import {
  ModalBackdrop,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  ModalTitle,
  ModalViewport,
} from './atoms';
import { ModalContext } from './context';
import type { ImperativeModalProps, ModalInstance } from './type';

// --- Stack state ---

type ModalStackEntry = {
  id: string;
  props: ImperativeModalProps;
};

let modalStack: ModalStackEntry[] = [];
let modalSeed = 0;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const EMPTY: ModalStackEntry[] = [];
const getSnapshot = () => modalStack;
const getServerSnapshot = () => EMPTY;

// --- Stack operations ---

const updateModal = (id: string, next: Partial<ImperativeModalProps>) => {
  let changed = false;
  modalStack = modalStack.map((item) => {
    if (item.id !== id) return item;
    changed = true;
    return { ...item, props: { ...item.props, ...next } };
  });
  if (changed) notify();
};

const closeModal = (id: string) => {
  updateModal(id, { open: false });
};

const destroyModal = (id: string) => {
  const next = modalStack.filter((item) => item.id !== id);
  if (next.length === modalStack.length) return;
  modalStack = next;
  notify();
};

// --- Stack Item ---

const ModalStackItem = memo(({ entry }: { entry: ModalStackEntry }) => {
  const { id, props } = entry;
  const { title, content, children, open, maskClosable, width, classNames, styles, ...rest } =
    props;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) closeModal(id);
    rest.onOpenChange?.(nextOpen);
  };

  const handleOpenChangeComplete = (nextOpen: boolean) => {
    if (!nextOpen) destroyModal(id);
    rest.onOpenChangeComplete?.(nextOpen);
  };

  const close = () => closeModal(id);
  const setCanDismissByClickOutside = (value: boolean) => updateModal(id, { maskClosable: value });

  return (
    <ModalContext value={{ close, setCanDismissByClickOutside }}>
      <ModalRoot
        open={open ?? true}
        onOpenChange={handleOpenChange}
        onOpenChangeComplete={handleOpenChangeComplete}
        disablePointerDismissal={maskClosable === false}
      >
        <ModalPortal>
          <ModalBackdrop className={classNames?.backdrop} style={styles?.backdrop} />
          <ModalPopup className={classNames?.popup} style={styles?.popup} width={width}>
            {title !== undefined && (
              <ModalHeader className={classNames?.header} style={styles?.header}>
                <ModalTitle className={classNames?.title} style={styles?.title}>
                  {title}
                </ModalTitle>
                <ModalClose className={classNames?.close} style={styles?.close} />
              </ModalHeader>
            )}
            <ModalContent className={classNames?.content} style={styles?.content}>
              {content ?? children}
            </ModalContent>
          </ModalPopup>
        </ModalPortal>
      </ModalRoot>
    </ModalContext>
  );
});

ModalStackItem.displayName = 'ModalStackItem';

// --- ModalHost ---

const ModalPortalWrapper = ({
  children,
  root,
}: {
  children: ReactNode;
  root?: HTMLElement | ShadowRoot | null;
}) => {
  const appElement = useAppElement();
  const container = root ?? appElement ?? document.body;
  return createPortal(children, container);
};

const ModalStackRenderer = memo(({ stack }: { stack: ModalStackEntry[] }) => {
  const isClient = useIsClient();
  if (!isClient) return null;
  return stack.map((entry) => <ModalStackItem key={entry.id} entry={entry} />);
});

ModalStackRenderer.displayName = 'ModalStackRenderer';

export interface ModalHostProps {
  root?: HTMLElement | ShadowRoot | null;
}

export const ModalHost = ({ root }: ModalHostProps) => {
  const stack = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    const scope = root ?? document.body;
    return registerDevSingleton('BaseModalHost', scope);
  }, [isClient, root]);

  if (!isClient) return null;
  if (stack.length === 0) return null;

  return (
    <ModalPortalWrapper root={root}>
      <ModalStackRenderer stack={stack} />
    </ModalPortalWrapper>
  );
};

// --- createModal ---

export const createModal = (props: ImperativeModalProps): ModalInstance => {
  const id = `base-modal-${Date.now()}-${modalSeed++}`;
  modalStack = [...modalStack, { id, props: { ...props, open: props.open ?? true } }];
  notify();

  return {
    close: () => closeModal(id),
    destroy: () => destroyModal(id),
    setCanDismissByClickOutside: (value) => updateModal(id, { maskClosable: value }),
    update: (nextProps) => updateModal(id, nextProps),
  };
};
```

---

### Task 6: Create index exports

**Files:**

- Create: `src/base-ui/Modal/index.ts`
- Modify: `src/base-ui/index.ts`

**Step 1: Write Modal index.ts**

Follow the export pattern from `src/base-ui/Toast/index.ts`.

```ts
export { createModal, ModalHost, type ModalHostProps } from './imperative';
export { ModalContext, useModalContext } from './context';
export {
  ModalBackdrop,
  type ModalBackdropProps,
  ModalClose,
  type ModalCloseProps,
  ModalContent,
  type ModalContentProps,
  ModalDescription,
  type ModalDescriptionProps,
  ModalFooter,
  type ModalFooterProps,
  ModalHeader,
  type ModalHeaderProps,
  ModalPopup,
  type ModalPopupProps,
  ModalPortal,
  type ModalPortalProps,
  ModalRoot,
  type ModalRootProps,
  ModalTitle,
  type ModalTitleProps,
  ModalTrigger,
  type ModalTriggerProps,
  ModalViewport,
  type ModalViewportProps,
} from './atoms';
export type * from './type';
```

**Step 2: Add Modal to base-ui/index.ts**

Add after the Toast export block in `src/base-ui/index.ts`:

```ts
export {
  createModal,
  type BaseModalProps,
  type ImperativeModalProps,
  ModalBackdrop,
  ModalClose,
  ModalContent,
  ModalContext,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalHost,
  type ModalHostProps,
  type ModalInstance,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  ModalTitle,
  ModalTrigger,
  ModalViewport,
  useModalContext,
} from './Modal';
```

---

### Task 7: Lint and typecheck changed files

**Step 1: Run lint on new files**

Run: `npx eslint src/base-ui/Modal/`

**Step 2: Fix any lint/type errors**

Fix issues reported by eslint and tsc.

**Step 3: Commit**

```bash
git add src/base-ui/Modal/ src/base-ui/index.ts
git commit -m "feat(base-ui): add Modal component with declarative atoms and imperative API"
```
