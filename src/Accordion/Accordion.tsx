'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { styleProps } from '@/styles/stylex/props';

import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from './atoms';
import { styles } from './style';
import type { AccordionProps } from './type';

const Accordion: FC<AccordionProps> = ({
  className,
  classNames,
  defaultValue,
  gap,
  hideIndicator,
  indicatorPlacement = 'start',
  items,
  keepMounted,
  multiple = true,
  onValueChange,
  ref,
  style,
  styles: customStyles,
  value,
  variant = 'borderless',
}) => {
  return (
    <AccordionRoot
      className={clsx(classNames?.root, className)}
      defaultValue={defaultValue}
      hideIndicator={hideIndicator}
      indicatorPlacement={indicatorPlacement}
      multiple={multiple}
      ref={ref}
      style={{ gap, ...style, ...customStyles?.root }}
      value={value}
      variant={variant}
      onValueChange={onValueChange ? (next) => onValueChange(next as string[]) : undefined}
    >
      {items?.map((item) => (
        <AccordionItem
          className={classNames?.item}
          disabled={item.disabled}
          key={item.key}
          style={customStyles?.item}
          value={item.key}
        >
          <AccordionHeader className={classNames?.header} style={customStyles?.header}>
            <AccordionTrigger className={classNames?.trigger} style={customStyles?.trigger}>
              {item.title}
            </AccordionTrigger>
            {item.action && (
              <div
                {...styleProps(
                  [
                    styles.action,
                    variant === 'borderless' ? styles.actionBorderless : styles.actionOutlined,
                    item.alwaysShowAction && styles.actionAlwaysVisible,
                    indicatorPlacement === 'inline' &&
                      variant !== 'outlined' &&
                      styles.actionInline,
                  ],
                  clsx('accordion-action', classNames?.action),
                  customStyles?.action,
                )}
              >
                {item.action}
              </div>
            )}
          </AccordionHeader>
          <AccordionPanel
            className={classNames?.panel}
            contentClassName={classNames?.content}
            contentStyle={customStyles?.content}
            keepMounted={keepMounted}
            style={customStyles?.panel}
          >
            {item.children}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
};

Accordion.displayName = 'Accordion';

export default Accordion;
