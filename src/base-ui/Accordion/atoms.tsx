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

export const AccordionRoot: FC<AccordionRootProps> = ({
  children,
  className,
  hideIndicator = false,
  indicatorPlacement = 'start',
  variant = 'borderless',
  ...rest
}) => {
  const contextValue = useMemo(
    () => ({ hideIndicator, indicatorPlacement, variant }),
    [hideIndicator, indicatorPlacement, variant],
  );

  return (
    <AccordionContext value={contextValue}>
      <BaseUIAccordion.Root className={cx(rootVariants({ variant }), className)} {...rest}>
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
  variant: variantProp,
  ...rest
}) => {
  const ctx = useAccordionContext();
  const variant = variantProp ?? ctx.variant;

  return (
    <BaseUIAccordion.Header className={cx(headerVariants({ variant }), className)} {...rest} />
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
      {placement === 'start' ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
    </span>
  );

  return (
    <BaseUIAccordion.Trigger className={cx(triggerVariants({ variant }), className)} {...rest}>
      {placement === 'start' && indicator}
      {children}
      {placement === 'end' && indicator}
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

  return (
    <BaseUIAccordion.Panel className={cx(styles.panel, className)} {...rest}>
      <div
        className={cx(contentVariants({ indent, variant }), contentClassName)}
        style={contentStyle}
      >
        {children}
      </div>
    </BaseUIAccordion.Panel>
  );
};

AccordionPanel.displayName = 'AccordionPanel';

export { styles as accordionStyles } from './style';
