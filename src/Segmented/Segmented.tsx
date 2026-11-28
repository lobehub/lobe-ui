'use client';

import { Toggle as BaseUIToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseUIToggleGroup } from '@base-ui/react/toggle-group';
import clsx from 'clsx';
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

import { useControlledState } from '@/hooks/useControlledState';
import { A2uiField, a2uiFieldStyles } from '@/internal/a2ui/standardField';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { styles as a2uiSegmentedStyles } from './a2uiStyle';
import {
  SegmentedIndicator,
  SegmentedItem,
  SegmentedItemIcon,
  SegmentedItemLabel,
  SegmentedRoot,
} from './atoms';
import { segmentedClasses } from './stable';
import type { SegmentedOption, SegmentedProps } from './type';

const normalizeOption = <Value extends string>(
  option: SegmentedOption<Value> | Value,
): SegmentedOption<Value> =>
  typeof option === 'string' ? { label: option, value: option } : option;

const Segmented = <Value extends string = string>({
  block = false,
  className,
  classNames,
  defaultValue,
  disabled = false,
  glass = false,
  id,
  label,
  name,
  onChange,
  options,
  ref,
  shadow = false,
  size = 'middle',
  style,
  styles: customStyles,
  value,
  variant = 'filled',
  vertical = false,
}: SegmentedProps<Value>) => {
  const [innerValue, setInnerValue] = useControlledState<Value | undefined>(defaultValue, {
    defaultValue,
    onChange: (next) => {
      if (next != null) onChange?.(next);
    },
    value,
  });

  const listRef = useRef<HTMLDivElement | null>(null);

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  const normalizedOptions = useMemo(
    () => (options ?? []).map((o) => normalizeOption<Value>(o)),
    [options],
  );

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[data-segmented-item][data-pressed]');
    if (!active) {
      list.style.setProperty('--active-item-left', '0px');
      list.style.setProperty('--active-item-top', '0px');
      list.style.setProperty('--active-item-right', '0px');
      list.style.setProperty('--active-item-width', '0px');
      list.style.setProperty('--active-item-height', '0px');
      return;
    }
    list.style.setProperty('--active-item-left', `${active.offsetLeft}px`);
    list.style.setProperty('--active-item-top', `${active.offsetTop}px`);
    list.style.setProperty(
      '--active-item-right',
      `${list.clientWidth - active.offsetLeft - active.offsetWidth}px`,
    );
    list.style.setProperty('--active-item-width', `${active.offsetWidth}px`);
    list.style.setProperty('--active-item-height', `${active.offsetHeight}px`);
  }, []);

  useLayoutEffect(() => {
    updateIndicator();
  }, [innerValue, normalizedOptions, vertical, size, block, updateIndicator]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => updateIndicator());
    ro.observe(list);
    return () => ro.disconnect();
  }, [updateIndicator]);

  const groupValue = useMemo<Value[]>(() => (innerValue != null ? [innerValue] : []), [innerValue]);

  // `list` is the same element as `root` (the toggle group holds the items directly).
  const rootStyle: CSSProperties = { ...style, ...customStyles?.list, ...customStyles?.root };
  const labelId = useId();

  if (variant === 'a2ui') {
    // Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `SegmentedControl`.
    const control = (
      <BaseUIToggleGroup<Value>
        aria-labelledby={label == null ? undefined : labelId}
        data-variant={variant}
        disabled={disabled}
        id={id}
        ref={mergedRef}
        {...toDataAttributes({ block })}
        {...styleProps(
          [
            a2uiStyles.base,
            a2uiFieldStyles.base,
            a2uiSegmentedStyles.root,
            block && a2uiSegmentedStyles.rootBlock,
            disabled && a2uiSegmentedStyles.rootDisabled,
          ],
          clsx(segmentedClasses(), classNames?.root, classNames?.list, className),
          rootStyle,
        )}
        value={groupValue}
        onValueChange={(next) => {
          const picked = next[0];
          if (picked != null) setInnerValue(picked);
        }}
      >
        {normalizedOptions.map((opt) => (
          <BaseUIToggle<Value>
            aria-label={typeof opt.label === 'string' ? opt.label : undefined}
            data-segmented-item=""
            disabled={disabled || opt.disabled}
            key={opt.value}
            title={opt.title}
            value={opt.value}
            {...styleProps(
              [a2uiSegmentedStyles.item, block && a2uiSegmentedStyles.itemBlock],
              clsx(segmentedClasses('item'), classNames?.item, opt.className),
              customStyles?.item,
            )}
          >
            {opt.icon != null && (
              <SegmentedItemIcon className={classNames?.itemIcon} style={customStyles?.itemIcon}>
                {opt.icon}
              </SegmentedItemIcon>
            )}
            {opt.label != null && (
              <SegmentedItemLabel className={classNames?.itemLabel} style={customStyles?.itemLabel}>
                {opt.label}
              </SegmentedItemLabel>
            )}
          </BaseUIToggle>
        ))}
      </BaseUIToggleGroup>
    );
    if (label == null) return control;
    return (
      <A2uiField label={label} labelId={labelId}>
        {control}
      </A2uiField>
    );
  }

  return (
    <SegmentedRoot<Value>
      {...toDataAttributes({ size })}
      block={block}
      className={clsx(classNames?.root, classNames?.list, className)}
      disabled={disabled}
      glass={glass}
      id={id}
      orientation={vertical ? 'vertical' : 'horizontal'}
      ref={mergedRef}
      shadow={shadow}
      style={rootStyle}
      value={groupValue}
      variant={variant}
      onValueChange={(next) => {
        const picked = next[0];
        if (picked != null) setInnerValue(picked);
      }}
    >
      <SegmentedIndicator className={classNames?.indicator} style={customStyles?.indicator} />
      {normalizedOptions.map((opt) => (
        <SegmentedItem<Value>
          aria-label={typeof opt.label === 'string' ? opt.label : undefined}
          block={block}
          className={clsx(classNames?.item, opt.className)}
          data-segmented-item=""
          disabled={disabled || opt.disabled}
          key={opt.value}
          name={name}
          size={size}
          style={customStyles?.item}
          title={opt.title}
          value={opt.value}
        >
          {opt.icon != null && (
            <SegmentedItemIcon className={classNames?.itemIcon} style={customStyles?.itemIcon}>
              {opt.icon}
            </SegmentedItemIcon>
          )}
          {opt.label != null && (
            <SegmentedItemLabel className={classNames?.itemLabel} style={customStyles?.itemLabel}>
              {opt.label}
            </SegmentedItemLabel>
          )}
        </SegmentedItem>
      ))}
    </SegmentedRoot>
  );
};

Segmented.displayName = 'Segmented';

export default Segmented;
