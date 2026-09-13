'use client';

import { Accordion as BaseUIAccordion } from '@base-ui/react/accordion';
import { cx } from 'antd-style';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { createContext, type FC, use, useMemo } from 'react';

import {
  contentVariants,
  headerVariants,
  indicatorVariants,
  itemVariants,
  rootVariants,
  styles,
  triggerVariants,
} from './style';
import type {
  AccordionHeaderProps,
  AccordionIndicatorPlacement,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionRootProps,
  AccordionTriggerProps,
  AccordionVariant,
} from './type';

interface AccordionContextValue {
  hideIndicator: boolean;
  indicatorPlacement: AccordionIndicatorPlacement;
  variant: AccordionVariant;
}

const AccordionContext = createContext<AccordionContextValue>({
  hideIndicator: false,
  indicatorPlacement: 'start',
  variant: 'borderless',
});

export const useAccordionContext = () => use(AccordionContext);

const InlineArrowIcon = () => (
  <svg aria-hidden fill="currentColor" fillRule="evenodd" viewBox="0 0 16 16">
    <path d="M7.002 10.624a.5.5 0 01-.752-.432V5.808a.5.5 0 01.752-.432l3.758 2.192a.5.5 0 010 .864l-3.758 2.192z" />
  </svg>
);

export const AccordionRoot: FC<AccordionRootProps> = ({
  children,
  className,
  hideIndicator = false,
  indicatorPlacement = 'start',
  multiple = true,
  variant = 'borderless',
  ...rest
}) => {
  const contextValue = useMemo(
    () => ({ hideIndicator, indicatorPlacement, variant }),
    [hideIndicator, indicatorPlacement, variant],
  );

  return (
    <AccordionContext value={contextValue}>
      <BaseUIAccordion.Root
        className={cx(rootVariants({ variant }), className)}
        multiple={multiple}
        {...rest}
      >
        {children}
      </BaseUIAccordion.Root>
    </AccordionContext>
  );
};

AccordionRoot.displayName = 'AccordionRoot';

export const AccordionItem: FC<AccordionItemProps> = ({
  className,
  variant: variantProp,
  ...rest
}) => {
  const ctx = useAccordionContext();
  const variant = variantProp ?? ctx.variant;

  return <BaseUIAccordion.Item className={cx(itemVariants({ variant }), className)} {...rest} />;
};

AccordionItem.displayName = 'AccordionItem';

export const AccordionHeader: FC<AccordionHeaderProps> = ({
  className,
  indicatorPlacement: placementProp,
  variant: variantProp,
  ...rest
}) => {
  const ctx = useAccordionContext();
  const variant = variantProp ?? ctx.variant;
  const inline = (placementProp ?? ctx.indicatorPlacement) === 'inline';

  return (
    <BaseUIAccordion.Header
      className={cx(headerVariants({ inline, variant }), className)}
      {...rest}
    />
  );
};

AccordionHeader.displayName = 'AccordionHeader';

export const AccordionTrigger: FC<AccordionTriggerProps> = ({
  children,
  className,
  hideIndicator: hideIndicatorProp,
  indicatorPlacement: placementProp,
  variant: variantProp,
  ...rest
}) => {
  const ctx = useAccordionContext();
  const variant = variantProp ?? ctx.variant;
  const hideIndicator = hideIndicatorProp ?? ctx.hideIndicator;
  const placement = placementProp ?? ctx.indicatorPlacement;

  const indicator = !hideIndicator && (
    <span className={indicatorVariants({ placement })}>
      {placement === 'start' && <ChevronRight size={16} />}
      {placement === 'inline' && <InlineArrowIcon />}
      {placement === 'end' && <ChevronDown size={16} />}
    </span>
  );

  return (
    <BaseUIAccordion.Trigger className={cx(triggerVariants({ variant }), className)} {...rest}>
      {placement === 'start' && indicator}
      {children}
      {placement !== 'start' && indicator}
    </BaseUIAccordion.Trigger>
  );
};

AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionPanel: FC<AccordionPanelProps> = ({
  children,
  className,
  contentClassName,
  contentStyle,
  hideIndicator: hideIndicatorProp,
  indicatorPlacement: placementProp,
  variant: variantProp,
  ...rest
}) => {
  const ctx = useAccordionContext();
  const variant = variantProp ?? ctx.variant;
  const hideIndicator = hideIndicatorProp ?? ctx.hideIndicator;
  const placement = placementProp ?? ctx.indicatorPlacement;
  const indent = !hideIndicator && placement === 'start';
  const inline = placement === 'inline';

  return (
    <BaseUIAccordion.Panel className={cx(styles.panel, className)} {...rest}>
      <div
        className={cx(contentVariants({ indent, inline, variant }), contentClassName)}
        style={contentStyle}
      >
        {children}
      </div>
    </BaseUIAccordion.Panel>
  );
};

AccordionPanel.displayName = 'AccordionPanel';

export { styles as accordionStyles } from './style';
