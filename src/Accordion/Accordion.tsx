'use client';

import { Divider } from 'antd';
import { LayoutGroup } from 'motion/react';
import { Children, Fragment, isValidElement, memo, useCallback } from 'react';
import type { Key } from 'react';
import useMergeState from 'use-merge-value';

import { AccordionContext } from './context';
import { useStyles } from './style';
import type { AccordionProps } from './type';

const Accordion = memo<AccordionProps>(
  ({
    children,
    className: userClassName,
    style: userStyle,
    accordion = false,
    defaultExpandedKeys,
    expandedKeys: expandedKeysProp,
    onExpandedChange,
    variant = 'borderless',
    gap,
    showDivider = false,
    disableAnimation = false,
    hideIndicator = false,
    indicatorPlacement = 'start',
    keepContentMounted = true,
    classNames,
    styles: customStyles,
    motionProps,
    ref,
    ...rest
  }) => {
    const { cx, styles } = useStyles();

    // Convert children to array and filter valid elements
    const validChildren = Children.toArray(children).filter(isValidElement);

    // Collect all item keys
    const allItemKeys = validChildren.map((child, index) => (child.props as any).itemKey || index);

    // If defaultExpandedKeys or expandedKeys is undefined, expand all items by default
    const initialExpandedKeys = defaultExpandedKeys ?? allItemKeys;

    const [expandedKeys, setExpandedKeys] = useMergeState<Key[]>(initialExpandedKeys, {
      onChange: onExpandedChange,
      value: expandedKeysProp,
    });

    const toggleExpand = useCallback(
      (key: Key) => {
        const prev = expandedKeys;
        let newKeys: Key[];

        if (accordion) {
          newKeys = prev.includes(key) ? [] : [key];
        } else {
          newKeys = prev.includes(key) ? prev.filter((k: Key) => k !== key) : [...prev, key];
        }

        setExpandedKeys(newKeys);
      },
      [accordion, expandedKeys, setExpandedKeys],
    );

    const isExpanded = useCallback(
      (key: Key) => {
        return expandedKeys.includes(key);
      },
      [expandedKeys],
    );

    const contextValue = {
      disableAnimation,
      expandedKeys,
      hideIndicator,
      indicatorPlacement,
      isExpanded,
      keepContentMounted,
      motionProps,
      onToggle: toggleExpand,
      showDivider,
      variant,
    };

    const content = (
      <>
        {validChildren.map((child, index) => {
          // Extract itemKey from child props to use as React key
          const childKey = (child.props as any).itemKey || index;
          return (
            <Fragment key={childKey}>
              {child}
              {showDivider && index < validChildren.length - 1 && (
                <Divider className={styles.divider} />
              )}
            </Fragment>
          );
        })}
      </>
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          className={cx(styles.base, classNames?.base, userClassName)}
          ref={ref}
          style={{
            gap: gap,
            ...customStyles?.base,
            ...userStyle,
          }}
          {...rest}
        >
          {disableAnimation ? content : <LayoutGroup>{content}</LayoutGroup>}
        </div>
      </AccordionContext.Provider>
    );
  },
);

Accordion.displayName = 'Accordion';

export default Accordion;
