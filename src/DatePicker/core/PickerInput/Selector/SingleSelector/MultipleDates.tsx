import { clsx } from 'clsx';
import type { MouseEventHandler } from 'react';
import * as React from 'react';

import { OverflowList } from '@/internal/overflow';

import type { CustomTagProps, PickerProps } from '../../SinglePicker';

export interface MultipleDatesProps<DateType extends object = any> extends Pick<
  PickerProps,
  'maxTagCount' | 'tagRender'
> {
  disabled?: boolean;
  formatDate: (date: DateType) => string;
  onRemove: (value: DateType) => void;
  placeholder?: React.ReactNode;
  prefixCls: string;
  removeIcon?: React.ReactNode;
  value: DateType[];
}

export default function MultipleDates<DateType extends object = any>(
  props: MultipleDatesProps<DateType>,
) {
  const {
    prefixCls,
    value,
    onRemove,
    removeIcon = '×',
    formatDate,
    disabled,
    maxTagCount,
    tagRender,
    placeholder,
  } = props;

  const selectorCls = `${prefixCls}-selector`;
  const selectionCls = `${prefixCls}-selection`;
  const overflowCls = `${selectionCls}-overflow`;

  // ========================= Item =========================
  function renderSelector(content: React.ReactNode, onClose?: MouseEventHandler<HTMLSpanElement>) {
    return (
      <span
        className={clsx(`${selectionCls}-item`)}
        title={typeof content === 'string' ? content : undefined}
      >
        <span className={`${selectionCls}-item-content`}>{content}</span>
        {!disabled && onClose && (
          <span
            className={`${selectionCls}-item-remove`}
            onClick={onClose}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
          >
            {removeIcon}
          </span>
        )}
      </span>
    );
  }

  function renderItem(date: DateType) {
    const displayLabel: React.ReactNode = formatDate(date);
    const closable = !disabled;

    const onClose: CustomTagProps<DateType>['onClose'] = (event) => {
      if (event) event.stopPropagation();
      if (!disabled) {
        onRemove(date);
      }
    };

    if (tagRender) {
      return tagRender({
        label: displayLabel,
        value: date,
        disabled: !!disabled,
        closable,
        onClose,
      });
    }

    return renderSelector(displayLabel, onClose);
  }

  // ========================= Rest =========================
  function renderRest(omittedValues: DateType[]) {
    const content = `+ ${omittedValues.length} ...`;

    return renderSelector(content);
  }

  // ======================== Render ========================

  return (
    <div className={selectorCls}>
      <OverflowList
        data={value}
        itemKey={(date) => formatDate(date)}
        maxCount={maxTagCount}
        renderItem={renderItem}
        renderRest={renderRest}
        classNames={{
          item: `${overflowCls}-item`,
          rest: `${overflowCls}-item-rest`,
          root: overflowCls,
        }}
      />
      {!value.length && <span className={`${prefixCls}-selection-placeholder`}>{placeholder}</span>}
    </div>
  );
}
