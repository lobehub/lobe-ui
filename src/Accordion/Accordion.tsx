'use client';

import { Divider } from 'antd';
import { cx } from 'antd-style';
import { LayoutGroup } from 'motion/react';
import { type Key } from 'react';
import { Children, Fragment, isValidElement, memo, useCallback, useMemo, useRef } from 'react';
import useMergeState from 'use-merge-value';

import { AccordionConfigContext, AccordionItemStateProvider } from './context';
import { styles } from './style';
import { type AccordionProps } from './type';

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

    // Hold expandedKeys and setExpandedKeys via refs so toggleExpand can stay
    // reference-stable. use-merge-value's setter is recreated on every render,
    // so depending on it would force AccordionItemStateProvider's memoized
    // value to change identity each render — even when nothing toggled —
    // re-rendering every nested AccordionItem via "context changed".
    const expandedKeysRef = useRef(expandedKeys);
    expandedKeysRef.current = expandedKeys;
    const setExpandedKeysRef = useRef(setExpandedKeys);
    setExpandedKeysRef.current = setExpandedKeys;

    const toggleExpand = useCallback(
      (key: Key) => {
        const prev = expandedKeysRef.current;
        let newKeys: Key[];

        if (accordion) {
          newKeys = prev.includes(key) ? [] : [key];
        } else {
          newKeys = prev.includes(key) ? prev.filter((k: Key) => k !== key) : [...prev, key];
        }

        setExpandedKeysRef.current(newKeys);
      },
      [accordion],
    );

    const configValue = useMemo(
      () => ({
        disableAnimation,
        hideIndicator,
        indicatorPlacement,
        keepContentMounted,
        motionProps,
        showDivider,
        variant,
      }),
      [
        disableAnimation,
        hideIndicator,
        indicatorPlacement,
        keepContentMounted,
        motionProps,
        showDivider,
        variant,
      ],
    );

    const content = (
      <>
        {validChildren.map((child, index) => {
          const childKey = (child.props as any).itemKey ?? index;
          const itemIsOpen = expandedKeys.includes(childKey);
          return (
            <Fragment key={childKey}>
              <AccordionItemStateProvider
                isOpen={itemIsOpen}
                itemKey={childKey}
                onToggleKey={toggleExpand}
              >
                {child}
              </AccordionItemStateProvider>
              {showDivider && index < validChildren.length - 1 && (
                <Divider className={styles.divider} />
              )}
            </Fragment>
          );
        })}
      </>
    );

    return (
      <AccordionConfigContext value={configValue}>
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
      </AccordionConfigContext>
    );
  },
);

Accordion.displayName = 'Accordion';

export default Accordion;
