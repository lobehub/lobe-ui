import type { Key, ReactNode } from 'react';
import { createContext, memo, use, useMemo } from 'react';

interface AccordionItemStateValue {
  isOpen: boolean;
  isOpenKey: (key: Key) => boolean;
  itemKey: Key;
  onToggle: () => void;
  onToggleKey: (key: Key) => void;
  onToggleNestedKey: (key: Key) => void;
}

interface AccordionConfigValue {
  disableAnimation?: boolean;
  hideIndicator?: boolean;
  indicatorPlacement?: 'end' | 'start';
  keepContentMounted?: boolean;
  motionProps?: any;
  showDivider?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}

/**
 * Per-item context: each AccordionItem gets its own provider, so a toggle
 * only invalidates the value seen by that single item. Sibling items keep
 * the same context value identity and skip re-render.
 */
export const AccordionItemStateContext = createContext<AccordionItemStateValue | null>(null);

/**
 * Static config shared by all items. Identity changes only when the user
 * changes config props on <Accordion>, which is rare.
 */
export const AccordionConfigContext = createContext<AccordionConfigValue | null>(null);

export const useAccordionItemState = () => use(AccordionItemStateContext);
export const useAccordionConfig = () => use(AccordionConfigContext);

interface AccordionItemStateProviderProps {
  children: ReactNode;
  // Used only to refresh the memoized context for wrapper children when
  // controlled expanded keys change; direct children use `isOpen`.
  expandedKeys?: Key[];
  isOpen: boolean;
  isOpenKey: (key: Key) => boolean;
  itemKey: Key;
  onToggleKey: (key: Key) => void;
  onToggleKeys: (keys: Key[], preferredKey: Key) => void;
  preferProviderKeyForNestedItems: boolean;
}

export const AccordionItemStateProvider = memo<AccordionItemStateProviderProps>(
  ({
    children,
    expandedKeys,
    isOpenKey,
    isOpen,
    itemKey,
    onToggleKey,
    onToggleKeys,
    preferProviderKeyForNestedItems,
  }) => {
    const value = useMemo(
      () => ({
        isOpenKey,
        isOpen,
        itemKey,
        onToggle: () => onToggleKey(itemKey),
        onToggleKey,
        onToggleNestedKey: (key: Key) =>
          onToggleKeys([itemKey, key], preferProviderKeyForNestedItems ? itemKey : key),
      }),
      [
        expandedKeys,
        isOpenKey,
        isOpen,
        itemKey,
        onToggleKey,
        onToggleKeys,
        preferProviderKeyForNestedItems,
      ],
    );
    return <AccordionItemStateContext value={value}>{children}</AccordionItemStateContext>;
  },
);

AccordionItemStateProvider.displayName = 'AccordionItemStateProvider';
