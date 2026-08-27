'use client';

import { cx } from 'antd-style';
import { type FC } from 'react';

import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from './atoms';
import { actionVariants } from './style';
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
      className={cx(classNames?.root, className)}
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
                style={customStyles?.action}
                className={cx(
                  'accordion-action',
                  actionVariants({ alwaysVisible: item.alwaysShowAction, variant }),
                  classNames?.action,
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
