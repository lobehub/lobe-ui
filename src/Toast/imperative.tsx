'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import { cx } from 'antd-style';
import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { LOBE_THEME_APP_ID } from '@/ThemeProvider';
import { useIsClient } from '@/hooks/useIsClient';
import { registerDevSingleton } from '@/utils/devSingleton';

import ToastItem from './Toast';
import { ToastContext } from './context';
import { viewportVariants } from './style';
import type {
  ToastAPI,
  ToastInstance,
  ToastOptions,
  ToastPosition,
  ToastPromiseOptions,
  ToastType,
} from './type';

// All possible positions
const ALL_POSITIONS: ToastPosition[] = [
  'top',
  'top-left',
  'top-right',
  'bottom',
  'bottom-left',
  'bottom-right',
];

// Global state management
interface ToastState {
  duration: number;
  limit: number;
  position: ToastPosition;
  swipeDirection: ('left' | 'right' | 'up' | 'down') | ('left' | 'right' | 'up' | 'down')[];
}

let globalState: ToastState = {
  duration: 5000,
  limit: 5,
  position: 'bottom-right',
  swipeDirection: ['down', 'right'],
};

// Toast managers for each position
const toastManagers: Record<ToastPosition, ReturnType<typeof BaseToast.createToastManager>> = {
  'bottom': BaseToast.createToastManager(),
  'bottom-left': BaseToast.createToastManager(),
  'bottom-right': BaseToast.createToastManager(),
  'top': BaseToast.createToastManager(),
  'top-left': BaseToast.createToastManager(),
  'top-right': BaseToast.createToastManager(),
};

const activeToastIds: Record<ToastPosition, Set<string>> = {
  'bottom': new Set(),
  'bottom-left': new Set(),
  'bottom-right': new Set(),
  'top': new Set(),
  'top-left': new Set(),
  'top-right': new Set(),
};

const getManager = (position: ToastPosition) => toastManagers[position];

const normalizeOptions = (
  optionsOrMessage: Omit<ToastOptions, 'type'> | string,
  type: ToastType,
): ToastOptions => {
  if (typeof optionsOrMessage === 'string') {
    return {
      description: optionsOrMessage,
      type,
    };
  }
  return {
    ...optionsOrMessage,
    type,
  };
};

const createToastInstance = (id: string, position: ToastPosition): ToastInstance => ({
  close: () => getManager(position).close(id),
  id,
  update: (options) => {
    getManager(position).update(id, {
      data: options,
      description: options.description,
      title: options.title,
    });
  },
});

const addToast = (options: ToastOptions): ToastInstance => {
  const position = options.placement ?? globalState.position;
  const manager = getManager(position);
  const onRemove = options.onRemove;
  const id = manager.add({
    data: options,
    description: options.description,
    onClose: options.onClose,
    onRemove: () => {
      activeToastIds[position].delete(id);
      onRemove?.();
    },
    timeout: options.duration ?? globalState.duration,
    title: options.title,
  });
  activeToastIds[position].add(id);
  return createToastInstance(id, position);
};

const dismissToast = (id?: string) => {
  if (id) {
    // Try to close from all managers since we don't know which position the toast is in
    for (const [position, manager] of Object.entries(toastManagers)) {
      activeToastIds[position as ToastPosition].delete(id);
      manager.close(id);
    }
  } else {
    // Clear all toasts
    for (const [position, manager] of Object.entries(toastManagers)) {
      const ids = Array.from(activeToastIds[position as ToastPosition]);
      for (const toastId of ids) {
        manager.close(toastId);
      }
      activeToastIds[position as ToastPosition].clear();
    }
  }
};

const createSuccessToast = (
  optionsOrMessage: Omit<ToastOptions, 'type'> | string,
): ToastInstance => {
  return addToast(normalizeOptions(optionsOrMessage, 'success'));
};

const createErrorToast = (optionsOrMessage: Omit<ToastOptions, 'type'> | string): ToastInstance => {
  return addToast(normalizeOptions(optionsOrMessage, 'error'));
};

const createInfoToast = (optionsOrMessage: Omit<ToastOptions, 'type'> | string): ToastInstance => {
  return addToast(normalizeOptions(optionsOrMessage, 'info'));
};

const createWarningToast = (
  optionsOrMessage: Omit<ToastOptions, 'type'> | string,
): ToastInstance => {
  return addToast(normalizeOptions(optionsOrMessage, 'warning'));
};

const createLoadingToast = (
  optionsOrMessage: Omit<ToastOptions, 'type'> | string,
): ToastInstance => {
  const options = normalizeOptions(optionsOrMessage, 'loading');
  // Loading toasts don't auto-dismiss by default
  return addToast({ duration: 0, ...options });
};

async function promiseToast<T>(promise: Promise<T>, options: ToastPromiseOptions<T>): Promise<T> {
  const loadingOptions =
    typeof options.loading === 'string'
      ? { description: options.loading }
      : (options.loading as ToastOptions);

  const loadingToast = addToast({
    closable: false,
    duration: 0,
    type: 'loading',
    ...loadingOptions,
  });

  try {
    const result = await promise;

    loadingToast.close();

    const successOptions = (() => {
      if (typeof options.success === 'string') {
        return { description: options.success };
      }
      if (typeof options.success === 'function') {
        return { description: options.success(result) };
      }
      return options.success as ToastOptions;
    })();

    addToast({ type: 'success', ...successOptions });

    return result;
  } catch (error) {
    loadingToast.close();

    const errorOptions = (() => {
      if (typeof options.error === 'string') {
        return { description: options.error };
      }
      if (typeof options.error === 'function') {
        return { description: options.error(error as Error) };
      }
      return options.error as ToastOptions;
    })();

    addToast({ type: 'error', ...errorOptions });

    throw error;
  }
}

// Base toast function
const baseToast = (options: ToastOptions): ToastInstance => {
  return addToast({ type: 'default', ...options });
};

// Toast API
export const toast: ToastAPI = Object.assign(baseToast, {
  dismiss: dismissToast,
  error: createErrorToast,
  info: createInfoToast,
  loading: createLoadingToast,
  promise: promiseToast,
  success: createSuccessToast,
  warning: createWarningToast,
});

// Toast List Component
const ToastList = memo(() => {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((t) => <ToastItem key={t.id} toast={t} />);
});

ToastList.displayName = 'ToastList';

// Toast Host Component
const TOAST_PORTAL_ATTR = 'data-lobe-ui-toast-portal';
export const TOAST_CONTAINER_ATTR = 'data-lobe-ui-toast-container';

const containerMap = new WeakMap<object, HTMLElement>();

const getOrCreateContainer = (root: HTMLElement | ShadowRoot): HTMLElement => {
  const resolvedRoot = (() => {
    if (typeof document === 'undefined') return root;
    if (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot) return root;

    const isBody = root === document.body;
    if (!isBody) return root;

    const themeApp = document.querySelector<HTMLElement>(`#${LOBE_THEME_APP_ID}`);
    if (themeApp) return themeApp;

    const toastContainer = document.querySelector<HTMLElement>(`[${TOAST_CONTAINER_ATTR}="true"]`);
    if (toastContainer) return toastContainer;

    return root;
  })();

  const cached = containerMap.get(resolvedRoot);
  if (cached && cached.isConnected) return cached;

  const el = document.createElement('div');
  el.setAttribute(TOAST_PORTAL_ATTR, 'true');
  resolvedRoot.append(el);
  containerMap.set(resolvedRoot, el);
  return el;
};

const resolveRoot = (root?: HTMLElement | ShadowRoot | null): HTMLElement | ShadowRoot | null => {
  if (root) return root;
  return document.body;
};

export interface ToastHostProps {
  className?: string;
  /**
   * Default duration for toasts
   * @default 5000
   */
  duration?: number;
  /**
   * Maximum number of toasts
   * @default 5
   */
  limit?: number;
  /**
   * Toast position
   * @default 'bottom-right'
   */
  position?: ToastPosition;
  /**
   * Root element for portal
   */
  root?: HTMLElement | ShadowRoot | null;
  /**
   * Swipe direction to dismiss
   * @default ['down', 'right']
   */
  swipeDirection?: ('left' | 'right' | 'up' | 'down') | ('left' | 'right' | 'up' | 'down')[];
}

export const ToastHost = memo(
  ({
    root,
    className,
    duration = 5000,
    limit = 5,
    position = 'bottom-right',
    swipeDirection = ['down', 'right'],
  }: ToastHostProps) => {
    const isClient = useIsClient();
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
      globalState = {
        duration,
        limit,
        position,
        swipeDirection,
      };
    }, [duration, limit, position, swipeDirection]);

    useEffect(() => {
      if (!isClient) return;

      const resolved = resolveRoot(root);
      if (resolved) {
        setContainer(getOrCreateContainer(resolved));
      }

      const scope = root ?? document.body;
      return registerDevSingleton('ToastHost', scope);
    }, [isClient, root]);

    if (!isClient || !container) return null;

    return createPortal(
      <>
        {ALL_POSITIONS.map((pos) => (
          <ToastContext.Provider key={pos} value={{ position: pos, swipeDirection }}>
            <BaseToast.Provider limit={limit} timeout={duration} toastManager={getManager(pos)}>
              <BaseToast.Portal container={container}>
                <BaseToast.Viewport className={cx(viewportVariants({ position: pos }), className)}>
                  <ToastList />
                </BaseToast.Viewport>
              </BaseToast.Portal>
            </BaseToast.Provider>
          </ToastContext.Provider>
        ))}
      </>,
      container,
    );
  },
);

ToastHost.displayName = 'ToastHost';

// Hook to use toast manager
export const useToast = () => toast;
