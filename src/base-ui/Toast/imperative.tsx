'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import { cx } from 'antd-style';
import { memo, useEffect, useId, useState, useSyncExternalStore } from 'react';

import { useIsClient } from '@/hooks/useIsClient';
import { useAppElement } from '@/ThemeProvider';

import { acquireLayerZIndex } from '../zIndex';
import { ToastContext } from './context';
import { isActiveToastHost, registerToastHost, subscribeToastHost } from './hostGuard';
import {
  __resetPendingToastQueueForTests,
  markToastHostNotReady,
  markToastHostReady,
  runWhenToastHostReady,
} from './pendingQueue';
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

interface ActiveToast {
  superseded: boolean;
}

const activeToasts: Record<ToastPosition, Map<string, ActiveToast>> = {
  'bottom': new Map(),
  'bottom-left': new Map(),
  'bottom-right': new Map(),
  'top': new Map(),
  'top-left': new Map(),
  'top-right': new Map(),
};

const getManager = (position: ToastPosition) => toastManagers[position];

let toastIdCounter = 0;
const generateToastId = (): string =>
  `toast-${Date.now().toString(36)}-${(toastIdCounter++).toString(36)}`;

const findActivePosition = (id: string) => ALL_POSITIONS.find((pos) => activeToasts[pos].has(id));

// Base UI prepends every new toast, so the last entry we registered is the one
// currently rendered at the front of the stack.
const isFrontMost = (position: ToastPosition, id: string) =>
  Array.from(activeToasts[position].keys()).at(-1) === id;

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
  close: () => runWhenToastHostReady(() => getManager(position).close(id)),
  id,
  update: (options) => {
    runWhenToastHostReady(() =>
      getManager(position).update(id, {
        data: options,
        description: options.description,
        title: options.title,
      }),
    );
  },
});

// createToastManager() is a stateless emitter (see @base-ui/react/toast/createToastManager):
// add/close/update just broadcast to whatever is currently subscribed, and the
// ToastProvider that owns the real toast state only subscribes from a passive
// useEffect. Calls made while no host is ready (e.g. mid-handoff between the
// previously-active ToastHost unmounting and its successor's Provider
// subscribing) would otherwise be silently dropped, so every manager call is
// routed through runWhenToastHostReady to queue until a host is listening.
const addToast = (options: ToastOptions): ToastInstance => {
  const position = options.placement ?? globalState.position;
  const manager = getManager(position);
  const { id: dedupeId, onClose, onRemove } = options;

  if (dedupeId) {
    const prevPosition = findActivePosition(dedupeId);
    // Already the front-most toast: let Base UI upsert it in place so it only
    // refreshes its content and timer, without replaying the slide-in animation.
    const shouldPromote =
      prevPosition && !(prevPosition === position && isFrontMost(position, dedupeId));

    if (shouldPromote) {
      // Closing marks the toast as `ending`, which makes the following `add`
      // drop it and prepend a fresh one — Base UI's own upsert keeps the
      // original slot instead.
      activeToasts[prevPosition].get(dedupeId)!.superseded = true;
      activeToasts[prevPosition].delete(dedupeId);
      runWhenToastHostReady(() => getManager(prevPosition).close(dedupeId));
    }
  }

  const id = dedupeId ?? generateToastId();
  const active: ActiveToast = { superseded: false };
  activeToasts[position].set(id, active);
  runWhenToastHostReady(() => {
    manager.add({
      id,
      data: options,
      description: options.description,
      onClose: () => {
        if (active.superseded) return;
        onClose?.();
      },
      onRemove: () => {
        if (active.superseded) return;
        activeToasts[position].delete(id);
        onRemove?.();
      },
      timeout: options.duration ?? globalState.duration,
      title: options.title,
    });
  });
  return createToastInstance(id, position);
};

const dismissToast = (id?: string) => {
  if (id) {
    // Try to close from all managers since we don't know which position the toast is in
    for (const [position, manager] of Object.entries(toastManagers)) {
      activeToasts[position as ToastPosition].delete(id);
      runWhenToastHostReady(() => manager.close(id));
    }
  } else {
    // Clear all toasts
    for (const [position, manager] of Object.entries(toastManagers)) {
      const ids = Array.from(activeToasts[position as ToastPosition].keys());
      activeToasts[position as ToastPosition].clear();
      runWhenToastHostReady(() => {
        for (const toastId of ids) {
          manager.close(toastId);
        }
      });
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
    const [viewportZIndex, setViewportZIndex] = useState<number | undefined>(undefined);
    const hostId = useId();

    useEffect(() => registerToastHost(hostId), [hostId]);

    const isActive = useSyncExternalStore(
      subscribeToastHost,
      () => isActiveToastHost(hostId),
      () => false,
    );

    useEffect(() => {
      if (!isActive) return;
      globalState = {
        duration,
        limit,
        position,
        swipeDirection,
      };
    }, [duration, limit, position, swipeDirection, isActive]);

    useEffect(() => {
      if (!isActive) return;
      setViewportZIndex(acquireLayerZIndex('toast'));
    }, [isActive]);

    useEffect(() => {
      if (!isActive || !isClient) return undefined;
      // Runs after the six BaseToast.Provider children below have committed
      // and subscribed (child effects run before the parent's), so the
      // managers are guaranteed to have a live listener once this fires.
      markToastHostReady();
      return () => {
        markToastHostNotReady();
      };
    }, [isActive, isClient]);

    if (!isClient || !isActive) return null;

    const container = root ?? appElement ?? document.body;

    return ALL_POSITIONS.map((pos) => (
      <ToastContext key={pos} value={{ position: pos, swipeDirection }}>
        <BaseToast.Provider limit={limit} timeout={duration} toastManager={getManager(pos)}>
          <BaseToast.Portal container={container}>
            <BaseToast.Viewport
              className={cx(viewportVariants({ position: pos }), className)}
              style={{ zIndex: viewportZIndex }}
            >
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

export const __resetToastStateForTests = (): void => {
  globalState = {
    duration: 5000,
    limit: 5,
    position: 'bottom-right',
    swipeDirection: ['down', 'right'],
  };
  for (const position of ALL_POSITIONS) {
    toastManagers[position] = BaseToast.createToastManager();
    activeToasts[position].clear();
  }
  __resetPendingToastQueueForTests();
};
