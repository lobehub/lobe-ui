import type { Key } from 'react';
import { createContext, useContext } from 'react';

interface AccordionContextValue {
  disableAnimation?: boolean;
  expandedKeys: Key[];
  hideIndicator?: boolean;
  indicatorPlacement?: 'end' | 'start';
  isExpanded: (key: Key) => boolean;
  keepContentMounted?: boolean;
  motionProps?: any;
  onToggle: (key: Key) => void;
  showDivider?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export const useAccordionContext = () => {
  return useContext(AccordionContext);
};
