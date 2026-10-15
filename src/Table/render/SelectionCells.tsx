'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';

import ActionIcon from '@/ActionIcon';
import { Checkbox } from '@/Checkbox';
import DropdownMenu from '@/DropdownMenu';
import { Radio } from '@/Radio';

import { PREFIX_CLS } from '../constants';
import { useRowHalfSelected, useRowSelected, useSelectionSummary } from '../store/hooks';
import { styles } from '../style';
import type { TableCellAttributes } from '../type';
import { type BodyCellProps, CellShell, isRenderedCell } from './CellShell';
import { useSelectionView } from './context';

export const SelectionBodyCell = <T,>({
  index,
  leaf,
  record,
  renderIndex,
  rowKey,
}: BodyCellProps<T>) => {
  const selection = useSelectionView<T>();
  const checked = useRowSelected(rowKey);
  const halfChecked = useRowHalfSelected(rowKey);
  const checkboxProps = selection.checkboxPropsMap.get(rowKey) || {};
  const { onChange: onBoxChange, onClick: onBoxClick, ...boxProps } = checkboxProps;
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    (onBoxClick as ((event: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
  };

  let node: ReactNode;
  if (selection.type === 'radio') {
    const {
      classNames: _classNames,
      indeterminate: _indeterminate,
      shape: _shape,
      styles: _styles,
      ...radioProps
    } = boxProps;
    node = (
      <BaseRadioGroup
        className={stylex.props(styles.selectionRadioGroup).className}
        value={checked ? 'selected' : null}
        onValueChange={(_value, details) => {
          selection.actions.selectRadio(rowKey, details.event as Event);
          onBoxChange?.(true);
        }}
      >
        <Radio
          aria-label={`Select row ${renderIndex + 1}`}
          {...(radioProps as object)}
          value="selected"
          onClick={handleClick}
        />
      </BaseRadioGroup>
    );
  } else {
    const indeterminate =
      selection.expandType === 'nest' ? halfChecked : (checkboxProps.indeterminate ?? halfChecked);
    node = (
      <Checkbox
        aria-label={checked ? `Row ${renderIndex + 1} selected` : `Select row ${renderIndex + 1}`}
        {...boxProps}
        checked={checked}
        indeterminate={indeterminate}
        onClick={handleClick}
        onChange={(_next: boolean, details?: { event?: Event }) => {
          selection.actions.toggleCheckbox(rowKey, checked, details?.event);
          onBoxChange?.(!checked);
        }}
      />
    );
  }

  const custom = selection.renderCell
    ? selection.renderCell(checked, record, renderIndex, node)
    : node;
  const [childNode, legacyCellProps] = isRenderedCell(custom)
    ? [custom.children, custom.props as TableCellAttributes | undefined]
    : [custom as ReactNode, undefined];

  return (
    <CellShell index={index} leaf={leaf} legacyCellProps={legacyCellProps} record={record}>
      {childNode}
    </CellShell>
  );
};

export const SelectionHeaderTitle = () => {
  const selection = useSelectionView();
  const summary = useSelectionSummary();
  if (selection.type === 'radio') {
    return typeof selection.title === 'function'
      ? selection.title(null)
      : (selection.title ?? null);
  }

  const customizeSelections = selection.selections ? (
    <div
      className={clsx(
        stylex.props(styles.selectionExtra).className,
        `${PREFIX_CLS}-selection-extra`,
      )}
    >
      <DropdownMenu
        items={selection.selections.map(({ key, onSelect, text }) => ({
          key,
          label: text,
          onClick: onSelect,
        }))}
      >
        <ActionIcon
          aria-label="Selection options"
          className={stylex.props(styles.selectionTrigger).className}
          icon={ChevronDown}
          size="small"
        />
      </DropdownMenu>
    </div>
  ) : null;

  const {
    disabled: titleDisabled,
    onChange: onTitleChange,
    ...titleCheckboxProps
  } = selection.getTitleCheckboxProps?.() || {};
  const { locale } = selection;
  const checkbox = (
    <Checkbox
      aria-label={
        customizeSelections
          ? 'Custom selection'
          : typeof locale.selectAll === 'string'
            ? locale.selectAll
            : undefined
      }
      {...titleCheckboxProps}
      checked={summary.checked}
      disabled={titleDisabled ?? summary.disabled}
      indeterminate={summary.indeterminate}
      onChange={(next) => {
        selection.actions.selectAll();
        onTitleChange?.(next);
      }}
    />
  );

  if (selection.title) {
    return typeof selection.title === 'function' ? selection.title(checkbox) : selection.title;
  }
  if (selection.hideSelectAll) return null;
  return (
    <div className={clsx(stylex.props(styles.selection).className, `${PREFIX_CLS}-selection`)}>
      {checkbox}
      {customizeSelections}
    </div>
  );
};
