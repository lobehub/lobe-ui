import { type ReactNode, isValidElement, useMemo } from 'react';

export interface UseNativeButtonOptions {
  /**
   * The children element that will be used as the trigger
   */
  children: ReactNode;
  /**
   * User-provided nativeButton prop
   */
  nativeButton?: boolean;
  /**
   * Additional nativeButton from trigger props (for DropdownMenu)
   */
  triggerNativeButton?: boolean;
}

export interface UseNativeButtonResult {
  /**
   * Whether the trigger element is a native button
   */
  isNativeButtonTriggerElement: boolean;
  /**
   * The resolved nativeButton value to pass to Base UI components
   */
  resolvedNativeButton: boolean | undefined;
}

/**
 * Hook to resolve nativeButton prop for Base UI trigger components.
 *
 * When using `render`, Base UI expects the rendered element to be a native <button> by default.
 * If we can infer it's not, we opt out to avoid warnings (users can still override via `nativeButton`).
 */
export function useNativeButton({
  children,
  nativeButton,
  triggerNativeButton,
}: UseNativeButtonOptions): UseNativeButtonResult {
  const isNativeButtonTriggerElement = useMemo(() => {
    if (!isValidElement(children)) return false;
    return typeof children.type === 'string' && children.type === 'button';
  }, [children]);

  const resolvedNativeButton = useMemo(() => {
    // User-provided nativeButton takes highest priority
    if (nativeButton !== undefined) return nativeButton;
    // Trigger props nativeButton (for DropdownMenu) takes second priority
    if (triggerNativeButton !== undefined) return triggerNativeButton;
    // If it's a native button element, return true
    if (isNativeButtonTriggerElement) return true;
    // If children is not a valid element, let Base UI decide
    if (!isValidElement(children)) return undefined;
    // If it's a string type but not a button (e.g., 'div'), return false
    if (typeof children.type === 'string') return false;
    // For React components, let Base UI decide
    return undefined;
  }, [children, isNativeButtonTriggerElement, nativeButton, triggerNativeButton]);

  return {
    isNativeButtonTriggerElement,
    resolvedNativeButton,
  };
}
