'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import { cx } from 'antd-style';
import { memo, useEffect } from 'react';

import { useIsClient } from '@/hooks/useIsClient';
import { useAppElement } from '@/ThemeProvider';

import { ToastContext } from './context';
import { viewportVariants } from './style';
import ToastItem from './Toast';
import {
  type ToastAPI,
  type ToastInstance,
  type ToastOptions,
  type ToastPosition,
  type ToastPromiseOptions,
  type ToastType,
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
    const appElement = useAppElement();

    useEffect(() => {
      globalState = {
        duration,
        limit,
        position,
        swipeDirection,
      };
    }, [duration, limit, position, swipeDirection]);

    if (!isClient) return null;

    const container = root ?? appElement ?? document.body;

    ALL_POSITIONS.map((pos) => (
      <ToastContext key={pos} value={{ position: pos, swipeDirection }}>
        <BaseToast.Provider limit={limit} timeout={duration} toastManager={getManager(pos)}>
          <BaseToast.Portal container={container}>
            <BaseToast.Viewport className={cx(viewportVariants({ position: pos }), className)}>
              <ToastList />
            </BaseToast.Viewport>
          </BaseToast.Portal>
        </BaseToast.Provider>
      </ToastContext>
    ));
  },
);

ToastHost.displayName = 'ToastHost';

// Hook to use toast manager
export const useToast = () => toast;
