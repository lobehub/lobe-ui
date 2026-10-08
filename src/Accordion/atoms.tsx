'use client';

import { Accordion as BaseUIAccordion } from '@base-ui/react/accordion';
import * as stylex from '@stylexjs/stylex';
import { ChevronDown, ChevronRight, Play } from 'lucide-react';
import { createContext, type FC, use, useMemo } from 'react';

import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';

import {
  accordionHeaderMarker,
  accordionPanelMarker,
  accordionTriggerMarker,
} from './marker.stylex';
import { styles } from './style';
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

const triggerVariantStyles = {
  borderless: styles.triggerBorderless,
  filled: styles.triggerFilled,
  outlined: styles.triggerOutlined,
};

const indicatorPlacementStyles = {
  end: styles.indicatorEnd,
  inline: styles.indicatorInline,
  start: styles.indicatorStart,
};

const contentVariantStyles = {
  borderless: styles.contentBorderless,
  filled: styles.contentBorderless,
  outlined: styles.contentOutlined,
};

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
        multiple={multiple}
        className={
          styleProps([styles.root, variant === 'outlined' && styles.rootOutlined], className)
            .className
        }
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

  return (
    <BaseUIAccordion.Item
      className={
        styleProps([styles.item, variant === 'outlined' && styles.itemOutlined], className)
          .className
      }
      {...rest}
    />
  );
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
      className={
        styleProps(
          [
            accordionHeaderMarker,
            styles.header,
            variant === 'borderless' && styles.headerBorderless,
            variant === 'filled' && styles.headerFilled,
            inline && variant !== 'outlined' && styles.headerInline,
          ],
          className,
        ).className
      }
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
    <span {...stylex.props(styles.indicator, indicatorPlacementStyles[placement])}>
      {placement === 'start' && <ChevronRight size={16} />}
      {placement === 'inline' && <Play fill="currentColor" size={7} strokeWidth={1} />}
      {placement === 'end' && <ChevronDown size={16} />}
    </span>
  );

  return (
    <BaseUIAccordion.Trigger
      className={
        styleProps(
          [accordionTriggerMarker, focusRing.info, styles.trigger, triggerVariantStyles[variant]],
          className,
        ).className
      }
      {...rest}
    >
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
    <BaseUIAccordion.Panel
      className={styleProps([accordionPanelMarker, styles.panel], className).className}
      {...rest}
    >
      <div
        {...styleProps(
          [
            styles.content,
            contentVariantStyles[variant],
            inline && variant === 'borderless' && styles.contentInline,
            indent && variant !== 'outlined' && styles.contentIndent,
            indent && variant === 'outlined' && styles.contentIndentOutlined,
          ],
          contentClassName,
          contentStyle,
        )}
      >
        {children}
      </div>
    </BaseUIAccordion.Panel>
  );
};

AccordionPanel.displayName = 'AccordionPanel';

export { accordionStyles } from './style';
