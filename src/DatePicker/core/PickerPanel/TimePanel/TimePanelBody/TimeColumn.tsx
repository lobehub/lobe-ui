import { clsx } from 'clsx';
import * as React from 'react';

import { useLayoutEffect } from '../../../hooks/react';
import { usePanelContext } from '../../context';
import useScrollTo from './useScrollTo';

const SCROLL_DELAY = 300;

export type Unit<ValueType = number | string> = {
  label: string | number;
  value: ValueType;
  disabled?: boolean;
};

export interface TimeUnitColumnProps<ValueType extends number | string = number | string> {
  changeOnScroll?: boolean;
  onChange: (value: ValueType) => void;
  onDblClick?: VoidFunction;
  onHover: (value: ValueType | null) => void;
  optionalValue?: ValueType;
  type: 'hour' | 'minute' | 'second' | 'millisecond' | 'meridiem';
  units: Unit<ValueType>[];
  value: ValueType | null;
}

// Not use JSON.stringify to avoid dead loop
function flattenUnits(units: Unit<string | number>[]) {
  return units.map(({ value, label, disabled }) => [value, label, disabled].join(',')).join(';');
}

export default function TimeColumn<
  DateType extends object,
  ValueType extends number | string = number | string,
>(props: TimeUnitColumnProps<ValueType>) {
  const { units, value, optionalValue, type, onChange, onHover, onDblClick, changeOnScroll } =
    props;

  const { prefixCls, cellRender, now, locale, classNames, styles } = usePanelContext<DateType>();

  const panelPrefixCls = `${prefixCls}-time-panel`;
  const cellPrefixCls = `${prefixCls}-time-panel-cell`;

  // ========================== Refs ==========================
  const ulRef = React.useRef<HTMLUListElement>(null);

  // ========================= Scroll =========================
  const checkDelayRef = React.useRef<any>(undefined);

  const clearDelayCheck = () => {
    clearTimeout(checkDelayRef.current);
  };

  // ========================== Sync ==========================
  const [syncScroll, stopScroll, isScrolling] = useScrollTo(ulRef, value ?? optionalValue);

  // Effect sync value scroll
  useLayoutEffect(() => {
    syncScroll();
    clearDelayCheck();

    return () => {
      stopScroll();
      clearDelayCheck();
    };
  }, [value, optionalValue, flattenUnits(units)]);

  // ========================= Change =========================
  // Scroll event if sync onScroll
  const onInternalScroll: React.UIEventHandler<HTMLUListElement> = (event) => {
    clearDelayCheck();

    const target = event.target as HTMLUListElement;

    if (!isScrolling() && changeOnScroll) {
      checkDelayRef.current = setTimeout(() => {
        const ul = ulRef.current!;
        const firstLiTop = ul.querySelector<HTMLLIElement>(`li`)!.offsetTop;
        const liList = Array.from(ul.querySelectorAll<HTMLLIElement>(`li`));
        const liTopList = liList.map((li) => li.offsetTop - firstLiTop);
        const liDistList = liTopList.map((top, index) => {
          if (units[index].disabled) {
            return Number.MAX_SAFE_INTEGER;
          }
          return Math.abs(top - target.scrollTop);
        });

        // Find min distance index
        const minDist = Math.min(...liDistList);
        const minDistIndex = liDistList.indexOf(minDist);
        const targetUnit = units[minDistIndex];
        if (targetUnit && !targetUnit.disabled) {
          onChange(targetUnit.value);
        }
      }, SCROLL_DELAY);
    }
  };

  // ========================= Render =========================
  const columnPrefixCls = `${panelPrefixCls}-column`;

  return (
    <ul className={columnPrefixCls} data-type={type} ref={ulRef} onScroll={onInternalScroll}>
      {units.map(({ label, value: unitValue, disabled }) => {
        const inner = <div className={`${cellPrefixCls}-inner`}>{label}</div>;

        return (
          <li
            data-value={unitValue}
            key={unitValue}
            style={styles.item}
            className={clsx(cellPrefixCls, classNames.item, {
              [`${cellPrefixCls}-selected`]: value === unitValue,
              [`${cellPrefixCls}-disabled`]: disabled,
            })}
            onClick={() => {
              if (!disabled) {
                onChange(unitValue);
              }
            }}
            onDoubleClick={() => {
              if (!disabled && onDblClick) {
                onDblClick();
              }
            }}
            onMouseEnter={() => {
              onHover(unitValue);
            }}
            onMouseLeave={() => {
              onHover(null);
            }}
          >
            {cellRender
              ? cellRender(unitValue, {
                  prefixCls,
                  originNode: inner,
                  today: now,
                  type: 'time',
                  subType: type,
                  locale,
                })
              : inner}
          </li>
        );
      })}
    </ul>
  );
}
