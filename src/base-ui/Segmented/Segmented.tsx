'use client';

import { cx } from 'antd-style';
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import useControlledState from 'use-merge-value';

import {
  SegmentedIndicator,
  SegmentedItem,
  SegmentedItemIcon,
  SegmentedItemLabel,
  SegmentedRoot,
} from './atoms';
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
      list.style.setProperty('--active-item-width', '0px');
      list.style.setProperty('--active-item-height', '0px');
      return;
    }
    list.style.setProperty('--active-item-left', `${active.offsetLeft}px`);
    list.style.setProperty('--active-item-top', `${active.offsetTop}px`);
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

  const rootStyle: CSSProperties = { ...style, ...customStyles?.root };

  return (
    <SegmentedRoot<Value>
      block={block}
      className={cx(classNames?.root, className)}
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
          className={cx(classNames?.item, opt.className)}
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
