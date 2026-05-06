import type { Key, ReactNode } from 'react';
import { createContext, memo, use, useMemo } from 'react';

interface AccordionItemStateValue {
  isOpen: boolean;
  onToggle: () => void;
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
  isOpen: boolean;
  itemKey: Key;
  onToggleKey: (key: Key) => void;
}

export const AccordionItemStateProvider = memo<AccordionItemStateProviderProps>(
  ({ children, isOpen, itemKey, onToggleKey }) => {
    const value = useMemo(
      () => ({
        isOpen,
        onToggle: () => onToggleKey(itemKey),
      }),
      [isOpen, itemKey, onToggleKey],
    );
    return <AccordionItemStateContext value={value}>{children}</AccordionItemStateContext>;
  },
);

AccordionItemStateProvider.displayName = 'AccordionItemStateProvider';
