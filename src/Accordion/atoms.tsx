'use client';

import './style.css';

import { Accordion as BaseUIAccordion } from '@base-ui/react/accordion';
import clsx from 'clsx';
import { ChevronDown, ChevronRight, ChevronUp, Play } from 'lucide-react';
import { createContext, type FC, use, useMemo } from 'react';

import { a2uiStyles } from '@/internal/a2ui/styles';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import {
  accordionHeaderMarker,
  accordionPanelMarker,
  accordionTriggerMarker,
} from './marker.stylex';
import { accordionClasses } from './stable';
import { a2uiAccordionStyles, styles } from './style';
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
  a2ui: a2uiAccordionStyles.trigger,
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
  a2ui: a2uiAccordionStyles.content,
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
        {...toDataAttributes({ indicatorPlacement, variant })}
        className={
          styleProps(
            [
              styles.root,
              variant === 'outlined' && styles.rootOutlined,
              variant === 'a2ui' && [a2uiStyles.base, a2uiStyles.card, a2uiAccordionStyles.root],
            ],
            clsx(accordionClasses(), className),
          ).className
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
        styleProps(
          [
            styles.item,
            variant === 'outlined' && styles.itemOutlined,
            variant === 'a2ui' && a2uiAccordionStyles.item,
          ],
          clsx(accordionClasses('item'), className),
        ).className
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
  const inline = (placementProp ?? ctx.indicatorPlacement) === 'inline' && variant !== 'outlined';

  return (
    <BaseUIAccordion.Header
      className={
        styleProps(
          [
            accordionHeaderMarker,
            variant === 'a2ui' ? a2uiAccordionStyles.header : styles.header,
            variant === 'borderless' && styles.headerBorderless,
            variant === 'filled' && styles.headerFilled,
            inline && styles.headerInline,
          ],
          clsx(inline && 'lobe-accordion-header-inline', accordionClasses('header'), className),
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

  const a2uiIndicator = !hideIndicator && variant === 'a2ui' && (
    <>
      <span
        {...styleProps(
          [a2uiAccordionStyles.indicator, a2uiAccordionStyles.indicatorClosed],
          accordionClasses('indicator'),
        )}
      >
        <ChevronDown size={16} />
      </span>
      <span
        {...styleProps(
          [a2uiAccordionStyles.indicator, a2uiAccordionStyles.indicatorOpen],
          accordionClasses('indicator'),
        )}
      >
        <ChevronUp size={16} />
      </span>
    </>
  );

  const indicator = !hideIndicator && variant !== 'a2ui' && (
    <span
      {...styleProps(
        [styles.indicator, indicatorPlacementStyles[placement]],
        accordionClasses('indicator'),
      )}
    >
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
          clsx(accordionClasses('trigger'), className),
        ).className
      }
      {...rest}
    >
      {placement === 'start' && indicator}
      {children}
      {placement !== 'start' && indicator}
      {a2uiIndicator}
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
  const indent = !hideIndicator && placement === 'start' && variant !== 'a2ui';
  const inline = placement === 'inline';

  return (
    <BaseUIAccordion.Panel
      className={
        styleProps([accordionPanelMarker, styles.panel], clsx(accordionClasses('panel'), className))
          .className
      }
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
          clsx(accordionClasses('content'), contentClassName),
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
