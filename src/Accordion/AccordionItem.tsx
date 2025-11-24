'use client';

import { AnimatePresence, LazyMotion, m } from 'framer-motion';
import { KeyboardEvent, memo, useCallback, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Block from '@/Block';
import Text from '@/Text';

import ArrowIcon from './ArrowIcon';
import { useAccordionContext } from './context';
import { useStyles } from './style';
import type { AccordionItemProps } from './type';

const loadFeatures = () => import('framer-motion').then((res) => res.domAnimation);

const AccordionItem = memo<AccordionItemProps>(
  ({
    itemKey,
    title,
    children,
    action,
    disabled = false,
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
  }) => {
    const { cx, styles } = useStyles();
    const context = useAccordionContext();

    const {
      isExpanded,
      onToggle,
      hideIndicator: contextHideIndicator,
      indicatorPlacement: contextIndicatorPlacement,
      keepContentMounted,
      disableAnimation,
      motionProps: contextMotionProps,
      variant = 'filled',
    } = context;

    const isOpen = isExpanded(itemKey);
    const hideIndicatorFinal = itemHideIndicator ?? contextHideIndicator ?? false;
    const indicatorPlacementFinal = itemIndicatorPlacement ?? contextIndicatorPlacement ?? 'start';

    const handleToggle = useCallback(() => {
      if (!disabled) {
        onToggle(itemKey);
      }
    }, [disabled, itemKey, onToggle]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
          case 'Enter':
          case ' ': {
            e.preventDefault();
            handleToggle();
            break;
          }
        }
      },
      [disabled, handleToggle],
    );

    // Build indicator
    const indicator = useMemo(() => {
      if (hideIndicatorFinal) return null;

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
      hideIndicatorFinal,
      customIndicator,
      disabled,
      isOpen,
      cx,
      styles,
      classNames,
      customStyles,
    ]);

    // Animation variants
    const motionProps = useMemo(
      () => ({
        animate: isOpen ? 'enter' : 'exit',
        exit: 'exit',
        initial: 'exit',
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
      [isOpen, contextMotionProps],
    );

    // Render content
    const contentElement = useMemo(() => {
      if (disableAnimation) {
        if (keepContentMounted) {
          return (
            <div
              className={cx('accordion-content', styles.content, classNames?.content)}
              role="region"
              style={{
                display: isOpen ? 'block' : 'none',
                ...customStyles?.content,
              }}
            >
              <div className={styles.contentInner}>{children}</div>
            </div>
          );
        }

        return (
          isOpen && (
            <div
              className={cx('accordion-content', styles.content, classNames?.content)}
              role="region"
              style={customStyles?.content}
            >
              <div className={styles.contentInner}>{children}</div>
            </div>
          )
        );
      }

      return keepContentMounted ? (
        <LazyMotion features={loadFeatures}>
          <m.div {...motionProps} style={{ overflow: 'hidden' }}>
            <div
              className={cx('accordion-content', styles.content, classNames?.content)}
              role="region"
              style={customStyles?.content}
            >
              <div className={styles.contentInner}>{children}</div>
            </div>
          </m.div>
        </LazyMotion>
      ) : (
        <AnimatePresence initial={false}>
          {isOpen && (
            <LazyMotion features={loadFeatures}>
              <m.div {...motionProps} style={{ overflow: 'hidden' }}>
                <div
                  className={cx('accordion-content', styles.content, classNames?.content)}
                  role="region"
                  style={customStyles?.content}
                >
                  <div className={styles.contentInner}>{children}</div>
                </div>
              </m.div>
            </LazyMotion>
          )}
        </AnimatePresence>
      );
    }, [
      disableAnimation,
      keepContentMounted,
      isOpen,
      cx,
      styles,
      classNames,
      customStyles,
      children,
      motionProps,
    ]);

    const titleNode = useMemo(
      () =>
        typeof title === 'string' ? (
          <Text className={classNames?.title} ellipsis style={customStyles?.title}>
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
            align={'center'}
            className={cx('accordion-action', styles.action, classNames?.action)}
            flex={'none'}
            gap={4}
            horizontal
            onClick={(e) => e.stopPropagation()}
            style={customStyles?.action}
          >
            {action}
          </Flexbox>
        ),
      [action, cx, styles, classNames?.action, customStyles?.action],
    );

    const headerElement = useMemo(() => {
      const header = (
        <Block
          className={cx('accordion-header', styles.header, classNames?.header)}
          clickable={!disabled}
          gap={4}
          horizontal
          justify={'space-between'}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          padding={padding}
          paddingBlock={paddingBlock}
          paddingInline={paddingInline}
          ref={ref}
          style={{
            alignItems: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : undefined,
            overflow: 'hidden',
            width: '100%',
          }}
          variant={customVariant || variant}
        >
          {indicatorPlacementFinal === 'start' ? (
            <>
              <Flexbox
                align={'center'}
                flex={1}
                gap={2}
                horizontal
                style={{
                  overflow: 'hidden',
                }}
              >
                {titleNode}
                {indicator}
              </Flexbox>
              <Flexbox align={'center'} flex={'none'} gap={4} horizontal>
                {actionNode}
              </Flexbox>
            </>
          ) : (
            <>
              <Flexbox
                align={'center'}
                flex={1}
                gap={2}
                horizontal
                style={{
                  overflow: 'hidden',
                }}
              >
                {titleNode}
              </Flexbox>
              <Flexbox align={'center'} flex={'none'} gap={4} horizontal>
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
      cx,
      styles,
      classNames,
      disabled,
      handleToggle,
      handleKeyDown,
      padding,
      paddingBlock,
      paddingInline,
      ref,
      customVariant,
      variant,
      indicatorPlacementFinal,
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
        {contentElement}
      </div>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

export default AccordionItem;
