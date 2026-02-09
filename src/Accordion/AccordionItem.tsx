'use client';

import { cx } from 'antd-style';
import { AnimatePresence } from 'motion/react';
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type KeyboardEvent,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import useMergeState from 'use-merge-value';

import Block from '@/Block';
import { Flexbox } from '@/Flex';
import { type MotionComponentType, useMotionComponent } from '@/MotionProvider';
import Text from '@/Text';
import { stopPropagation } from '@/utils/dom';

import ArrowIcon from './ArrowIcon';
import { useAccordionContext } from './context';
import { styles } from './style';
import { type AccordionItemProps } from './type';

type AccordionContentBaseProps = {
  children?: ReactNode;
  className?: string;
  contentInnerClassName: string;
  style?: CSSProperties;
};

type AccordionStaticContentProps = AccordionContentBaseProps & {
  isOpen: boolean;
  keepContentMounted: boolean;
};

type MotionDivProps = ComponentPropsWithoutRef<MotionComponentType['div']>;

type AccordionMotionContentProps = AccordionContentBaseProps & {
  contextMotionProps?: MotionDivProps;
  isOpen: boolean;
  skipInitialAnimation: boolean;
};

type AccordionItemContentProps = AccordionContentBaseProps & {
  contextMotionProps?: MotionDivProps;
  disableAnimation: boolean;
  isOpen: boolean;
  keepContentMounted: boolean;
  skipInitialAnimation: boolean;
};

const motionContainerStyle: CSSProperties = { overflow: 'hidden' };

const AccordionStaticContent = memo<AccordionStaticContentProps>(
  ({ className, style, children, contentInnerClassName, isOpen, keepContentMounted }) => {
    if (keepContentMounted) {
      return (
        <div
          className={className}
          role="region"
          style={{
            display: isOpen ? 'block' : 'none',
            ...style,
          }}
        >
          <div className={contentInnerClassName}>{children}</div>
        </div>
      );
    }

    if (!isOpen) return null;

    return (
      <div className={className} role="region" style={style}>
        <div className={contentInnerClassName}>{children}</div>
      </div>
    );
  },
);

AccordionStaticContent.displayName = 'AccordionStaticContent';

const AccordionMotionContent = memo<AccordionMotionContentProps>(
  ({
    contextMotionProps,
    className,
    style,
    children,
    contentInnerClassName,
    isOpen,
    skipInitialAnimation,
  }) => {
    const Motion = useMotionComponent();

    const motionProps = useMemo(
      () => ({
        animate: 'enter',
        exit: 'exit',
        initial: skipInitialAnimation ? false : 'exit',
        variants: {
          enter: {
            height: 'auto',
            opacity: 1,
            transition: {
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            },
          },
          exit: {
            height: 0,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            },
          },
        },
        ...contextMotionProps,
      }),
      [contextMotionProps, skipInitialAnimation],
    );

    return (
      <AnimatePresence initial={false}>
        {isOpen ? (
          <Motion.div {...(motionProps as any)} style={motionContainerStyle}>
            <div className={className} role="region" style={style}>
              <div className={contentInnerClassName}>{children}</div>
            </div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    );
  },
);

AccordionMotionContent.displayName = 'AccordionMotionContent';

const AccordionItemContent = memo<AccordionItemContentProps>(
  ({
    disableAnimation,
    isOpen,
    keepContentMounted,
    className,
    style,
    children,
    contentInnerClassName,
    contextMotionProps,
    skipInitialAnimation,
  }) => {
    if (disableAnimation || !keepContentMounted) {
      return (
        <AccordionStaticContent
          className={className}
          contentInnerClassName={contentInnerClassName}
          isOpen={isOpen}
          keepContentMounted={keepContentMounted}
          style={style}
        >
          {children}
        </AccordionStaticContent>
      );
    }

    return (
      <AccordionMotionContent
        className={className}
        contentInnerClassName={contentInnerClassName}
        contextMotionProps={contextMotionProps}
        isOpen={isOpen}
        skipInitialAnimation={skipInitialAnimation}
        style={style}
      >
        {children}
      </AccordionMotionContent>
    );
  },
);

AccordionItemContent.displayName = 'AccordionItemContent';

const AccordionItem = memo<AccordionItemProps>(
  ({
    itemKey,
    title,
    children,
    action,
    alwaysShowAction = false,
    disabled = false,
    allowExpand = true,
    hideIndicator: itemHideIndicator,
    indicatorPlacement: itemIndicatorPlacement,
    indicator: customIndicator,
    classNames,
    paddingInline = 16,
    paddingBlock = 8,
    padding,
    ref,
    variant: customVariant,
    styles: customStyles,
    headerWrapper,
    defaultExpand,
    expand,
    onExpandChange,
  }) => {
    const context = useAccordionContext();

    // Determine if using standalone mode (has expand or defaultExpand props)
    const isStandalone = expand !== undefined || defaultExpand !== undefined;

    // Standalone state management
    const [isExpandedStandalone, setIsExpandedStandalone] = useMergeState<boolean>(
      defaultExpand ?? false,
      {
        onChange: onExpandChange,
        value: expand,
      },
    );

    // Context values (may be null if used standalone)
    const contextIsExpanded = context?.isExpanded;
    const contextOnToggle = context?.onToggle;
    const contextHideIndicator = context?.hideIndicator;
    const contextIndicatorPlacement = context?.indicatorPlacement;
    const contextKeepContentMounted = context?.keepContentMounted;
    const contextDisableAnimation = context?.disableAnimation;
    const contextMotionProps = context?.motionProps;
    const contextVariant = context?.variant ?? 'borderless';

    const isInitialRenderRef = useRef(true);

    useEffect(() => {
      isInitialRenderRef.current = false;
    }, []);

    // Determine expanded state
    const isOpen = isStandalone
      ? isExpandedStandalone
      : contextIsExpanded
        ? contextIsExpanded(itemKey)
        : false;

    // Determine other props with fallbacks
    const hideIndicatorFinal = itemHideIndicator ?? contextHideIndicator ?? false;
    const indicatorPlacementFinal = itemIndicatorPlacement ?? contextIndicatorPlacement ?? 'start';
    const keepContentMounted = contextKeepContentMounted ?? true;
    const disableAnimation = contextDisableAnimation ?? false;
    const variant = customVariant || contextVariant;

    const handleToggle = useCallback(() => {
      // If allowExpand is false, only allow controlled expansion via expand prop
      if (!allowExpand) return;

      if (!disabled) {
        if (isStandalone) {
          setIsExpandedStandalone(!isExpandedStandalone);
        } else if (contextOnToggle) {
          contextOnToggle(itemKey);
        }
      }
    }, [
      allowExpand,
      disabled,
      isStandalone,
      setIsExpandedStandalone,
      isExpandedStandalone,
      contextOnToggle,
      itemKey,
    ]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        // If allowExpand is false, disable keyboard toggle
        if (!allowExpand || disabled) return;

        switch (e.key) {
          case 'Enter':
          case ' ': {
            e.preventDefault();
            handleToggle();
            break;
          }
        }
      },
      [allowExpand, disabled, handleToggle],
    );

    const preventTitleTextSelection = useCallback((e: any) => {
      // Prevent browser from creating a selection range on double/multi click,
      // which can accidentally select the content region.
      if (e?.detail > 1) e.preventDefault();
    }, []);

    // Build indicator
    const indicator = useMemo(() => {
      if (!allowExpand || hideIndicatorFinal) return null;

      if (customIndicator) {
        if (typeof customIndicator === 'function') {
          return (
            <span
              aria-hidden="true"
              className={cx(styles.indicator, classNames?.indicator)}
              style={customStyles?.indicator}
            >
              {customIndicator({ isDisabled: disabled, isOpen })}
            </span>
          );
        }
        return (
          <span
            aria-hidden="true"
            className={cx(styles.indicator, classNames?.indicator)}
            style={customStyles?.indicator}
          >
            {customIndicator}
          </span>
        );
      }

      return (
        <span
          aria-hidden="true"
          className={cx(styles.indicator, classNames?.indicator)}
          style={customStyles?.indicator}
        >
          <ArrowIcon className={cx(styles.icon, isOpen && styles.iconRotate)} />
        </span>
      );
    }, [
      allowExpand,
      hideIndicatorFinal,
      customIndicator,
      disabled,
      isOpen,
      classNames,
      customStyles,
    ]);

    const skipInitialAnimation = isInitialRenderRef.current && isOpen;

    const contentClassName = useMemo(
      () => cx('accordion-content', styles.content, classNames?.content),
      [classNames?.content],
    );

    const titleNode = useMemo(
      () =>
        typeof title === 'string' ? (
          <Text ellipsis className={classNames?.title} style={customStyles?.title}>
            {title}
          </Text>
        ) : (
          title
        ),
      [title, classNames?.title, customStyles?.title],
    );

    const actionNode = useMemo(
      () =>
        action && (
          <Flexbox
            horizontal
            align={'center'}
            flex={'none'}
            gap={4}
            style={customStyles?.action}
            className={cx(
              'accordion-action',
              styles.action,
              alwaysShowAction && styles.actionVisible,
              classNames?.action,
            )}
            onClick={stopPropagation}
          >
            {action}
          </Flexbox>
        ),
      [action, alwaysShowAction, cx, styles, classNames?.action, customStyles?.action],
    );

    const headerElement = useMemo(() => {
      const header = (
        <Block
          horizontal
          className={cx('accordion-header', styles.header, classNames?.header)}
          clickable={!disabled && allowExpand}
          gap={4}
          justify={'space-between'}
          padding={padding}
          paddingBlock={paddingBlock}
          paddingInline={paddingInline}
          ref={ref}
          variant={customVariant || variant}
          style={{
            alignItems: 'center',
            cursor: disabled ? 'not-allowed' : allowExpand ? 'pointer' : 'default',
            opacity: disabled ? 0.5 : undefined,
            overflow: 'hidden',
            width: '100%',
            ...customStyles?.header,
          }}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
        >
          {indicatorPlacementFinal === 'start' ? (
            <>
              <Flexbox
                horizontal
                align={'center'}
                className={styles.titleWrapper}
                flex={1}
                gap={2}
                style={{
                  overflow: 'hidden',
                }}
                onDoubleClick={preventTitleTextSelection}
                onMouseDown={preventTitleTextSelection}
              >
                {titleNode}
                {indicator}
              </Flexbox>
              <Flexbox horizontal align={'center'} flex={'none'} gap={4}>
                {actionNode}
              </Flexbox>
            </>
          ) : (
            <>
              <Flexbox
                horizontal
                align={'center'}
                className={styles.titleWrapper}
                flex={1}
                gap={2}
                style={{
                  overflow: 'hidden',
                }}
                onDoubleClick={preventTitleTextSelection}
                onMouseDown={preventTitleTextSelection}
              >
                {titleNode}
              </Flexbox>
              <Flexbox horizontal align={'center'} flex={'none'} gap={4}>
                {actionNode}
                {indicator}
              </Flexbox>
            </>
          )}
        </Block>
      );
      if (headerWrapper) {
        return headerWrapper(header);
      }
      return header;
    }, [
      classNames?.header,
      disabled,
      allowExpand,
      padding,
      paddingBlock,
      paddingInline,
      ref,
      customVariant,
      variant,
      customStyles?.header,
      handleToggle,
      handleKeyDown,
      indicatorPlacementFinal,
      preventTitleTextSelection,
      titleNode,
      indicator,
      actionNode,
      headerWrapper,
    ]);

    return (
      <div
        className={cx('accordion-item', styles.item, classNames?.base)}
        style={customStyles?.base}
      >
        {headerElement}
        <AccordionItemContent
          className={contentClassName}
          contentInnerClassName={styles.contentInner}
          contextMotionProps={contextMotionProps}
          disableAnimation={!!disableAnimation}
          isOpen={isOpen}
          keepContentMounted={!!keepContentMounted}
          skipInitialAnimation={skipInitialAnimation}
          style={customStyles?.content}
        >
          {children}
        </AccordionItemContent>
      </div>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

export default AccordionItem;
