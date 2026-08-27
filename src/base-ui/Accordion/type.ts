import { type Accordion as BaseUIAccordion } from '@base-ui/react/accordion';
import { type ComponentProps, type CSSProperties, type ReactNode, type Ref } from 'react';

export type AccordionVariant = 'borderless' | 'outlined';
export type AccordionIndicatorPlacement = 'end' | 'start';

export interface AccordionClassNames {
  action?: string;
  content?: string;
  header?: string;
  item?: string;
  panel?: string;
  root?: string;
  trigger?: string;
}

export interface AccordionStyles {
  action?: CSSProperties;
  content?: CSSProperties;
  header?: CSSProperties;
  item?: CSSProperties;
  panel?: CSSProperties;
  root?: CSSProperties;
  trigger?: CSSProperties;
}

export interface AccordionItemType {
  action?: ReactNode;
  alwaysShowAction?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  key: string;
  title: ReactNode;
}

export type AccordionRootProps = Omit<
  ComponentProps<typeof BaseUIAccordion.Root>,
  'className' | 'render'
> & {
  className?: string;
  hideIndicator?: boolean;
  indicatorPlacement?: AccordionIndicatorPlacement;
  variant?: AccordionVariant;
};

export type AccordionItemProps = Omit<
  ComponentProps<typeof BaseUIAccordion.Item>,
  'className' | 'render'
> & {
  className?: string;
  variant?: AccordionVariant;
};

export type AccordionHeaderProps = Omit<
  ComponentProps<typeof BaseUIAccordion.Header>,
  'className' | 'render'
> & {
  className?: string;
  variant?: AccordionVariant;
};

export type AccordionTriggerProps = Omit<
  ComponentProps<typeof BaseUIAccordion.Trigger>,
  'className' | 'render'
> & {
  className?: string;
  hideIndicator?: boolean;
  indicatorPlacement?: AccordionIndicatorPlacement;
  variant?: AccordionVariant;
};

export type AccordionPanelProps = Omit<
  ComponentProps<typeof BaseUIAccordion.Panel>,
  'className' | 'render'
> & {
  className?: string;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  hideIndicator?: boolean;
  indicatorPlacement?: AccordionIndicatorPlacement;
  variant?: AccordionVariant;
};

export interface AccordionProps {
  className?: string;
  classNames?: AccordionClassNames;
  defaultValue?: string[];
  gap?: number;
  hideIndicator?: boolean;
  indicatorPlacement?: AccordionIndicatorPlacement;
  items?: AccordionItemType[];
  keepMounted?: boolean;
  multiple?: boolean;
  onValueChange?: (value: string[]) => void;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  styles?: AccordionStyles;
  value?: string[];
  variant?: AccordionVariant;
}
