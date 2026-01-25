import { type ReactElement, type ReactNode, isValidElement, useMemo } from 'react';

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
 * Map of component displayNames to their nativeButton values.
 * Components that render native <button> elements should be true,
 * components that render non-button elements should be false.
 */
const NATIVE_BUTTON_MAP: Record<string, boolean> = {
  A: false,
  ActionIcon: false,
  ActionIconGroup: false,
  Alert: false,
  Avatar: false,
  AvatarGroup: false,
  Block: false,
  BottomGradientButton: true,
  Burger: false,
  Button: true,
  Center: false,
  Checkbox: false,
  CheckboxGroup: false,
  Collapse: false,
  ColorSwatches: false,
  CopyButton: false,
  DownloadButton: false,
  EditableText: false,
  Empty: false,
  FileTypeIcon: false,
  Flexbox: false,
  FluentEmoji: false,
  GradientButton: true,
  Highlighter: false,
  Hotkey: false,
  Icon: false,
  Image: false,
  Img: false,
  Input: false,
  InputNumber: false,
  InputPassword: false,
  List: false,
  ListItem: false,
  LobeSelect: false,
  LobeSwitch: false,
  Markdown: false,
  MaterialFileTypeIcon: false,
  Segmented: false,
  Skeleton: false,
  SkeletonAvatar: false,
  SkeletonBlock: false,
  SkeletonButton: false,
  SkeletonParagraph: false,
  SkeletonTags: false,
  SkeletonTitle: false,
  Snippet: false,
  Tag: false,
  Text: false,
  TextArea: false,
  ThemeSwitch: false,
  Video: false,
};

/**
 * Get the displayName of a React component from an element.
 * Handles function components, forwardRef, memo, etc.
 */
function getComponentDisplayName(element: ReactElement): string | undefined {
  const type = element.type;

  if (typeof type === 'string') return undefined;

  if (typeof type === 'function') {
    return (type as any).displayName || type.name;
  }

  if (typeof type === 'object' && type !== null) {
    // Handle forwardRef, memo, etc.
    const displayName =
      (type as any).displayName ||
      (type as any).render?.displayName ||
      (type as any).render?.name ||
      (type as any).type?.displayName ||
      (type as any).type?.name;
    return displayName;
  }

  return undefined;
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

    // Check if it's a known component from the library
    const displayName = getComponentDisplayName(children);
    if (displayName && displayName in NATIVE_BUTTON_MAP) {
      return NATIVE_BUTTON_MAP[displayName];
    }

    // For unknown React components, default to false to avoid warnings
    // since most custom components don't render native buttons
    return false;
  }, [children, isNativeButtonTriggerElement, nativeButton, triggerNativeButton]);

  return {
    isNativeButtonTriggerElement,
    resolvedNativeButton,
  };
}
