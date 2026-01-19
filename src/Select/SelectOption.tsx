import { Select as BaseSelect } from '@base-ui/react/select';
import { cx } from 'antd-style';
import { Check } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';
import { styles as menuStyles } from '@/Menu/sharedStyle';

import { styles } from './style';
import type { SelectOptionGroup, SelectOption as SelectOptionType, SelectOptions } from './type';
import { getOptionSearchText, isGroupOption } from './utils';

const CheckIconElement = <Icon icon={Check} size="small" />;

export interface SelectOptionItemProps<Value = any> {
  classNames?: {
    item?: string;
    itemIndicator?: string;
    itemText?: string;
    option?: string;
  };
  index: number;
  itemTextClassName: string;
  listItemHeight?: number;
  option: SelectOptionType<Value>;
  optionRender?: (option: SelectOptionType<Value>, info: { index: number }) => React.ReactNode;
}

export const SelectOptionItem = memo<SelectOptionItemProps>(
  ({ classNames, index, listItemHeight, option, optionRender, itemTextClassName }) => (
    <BaseSelect.Item
      className={cx(
        menuStyles.item,
        styles.item,
        classNames?.item,
        classNames?.option,
        option.className,
      )}
      disabled={option.disabled}
      key={`${String(option.value)}-${index}`}
      label={getOptionSearchText(option)}
      style={{
        minHeight: listItemHeight,
        ...option.style,
      }}
      value={option.value}
    >
      <BaseSelect.ItemText className={itemTextClassName}>
        {optionRender ? optionRender(option, { index }) : option.label}
      </BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className={cx(styles.itemIndicator, classNames?.itemIndicator)}>
        {CheckIconElement}
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  ),
);

SelectOptionItem.displayName = 'SelectOptionItem';

export interface SelectOptionGroupProps<Value = any> {
  classNames?: {
    group?: string;
    groupLabel?: string;
    item?: string;
    itemIndicator?: string;
    itemText?: string;
    option?: string;
  };
  group: SelectOptionGroup<Value>;
  groupIndex: number;
  itemTextClassName: string;
  listItemHeight?: number;
  optionIndexRef: { current: number };
  optionRender?: (option: SelectOptionType<Value>, info: { index: number }) => React.ReactNode;
}

export const SelectOptionGroupComponent = memo<SelectOptionGroupProps>(
  ({
    classNames,
    group,
    groupIndex,
    itemTextClassName,
    listItemHeight,
    optionIndexRef,
    optionRender,
  }) => (
    <BaseSelect.Group className={cx(styles.group, classNames?.group)} key={`group-${groupIndex}`}>
      <BaseSelect.GroupLabel
        className={cx(menuStyles.groupLabel, styles.groupLabel, classNames?.groupLabel)}
      >
        {group.label}
      </BaseSelect.GroupLabel>
      {group.options.map((option) => {
        const currentIndex = optionIndexRef.current++;
        return (
          <SelectOptionItem
            classNames={classNames}
            index={currentIndex}
            itemTextClassName={itemTextClassName}
            key={`${String(option.value)}-${currentIndex}`}
            listItemHeight={listItemHeight}
            option={option}
            optionRender={optionRender}
          />
        );
      })}
    </BaseSelect.Group>
  ),
);

SelectOptionGroupComponent.displayName = 'SelectOptionGroupComponent';

export interface SelectOptionsListProps<Value = any> {
  classNames?: {
    group?: string;
    groupLabel?: string;
    item?: string;
    itemIndicator?: string;
    itemText?: string;
    option?: string;
  };
  itemTextClassName: string;
  listItemHeight?: number;
  optionRender?: (option: SelectOptionType<Value>, info: { index: number }) => React.ReactNode;
  options: SelectOptions<Value>;
}

export const SelectOptionsList = <Value = any,>({
  classNames,
  itemTextClassName,
  listItemHeight,
  options,
  optionRender,
}: SelectOptionsListProps<Value>) => {
  const optionIndexRef = { current: 0 };

  return (
    <>
      {options.map((item, index) => {
        if (isGroupOption(item)) {
          return (
            <SelectOptionGroupComponent
              classNames={classNames}
              group={item}
              groupIndex={index}
              itemTextClassName={itemTextClassName}
              key={`group-${index}`}
              listItemHeight={listItemHeight}
              optionIndexRef={optionIndexRef}
              optionRender={optionRender}
            />
          );
        }

        const currentIndex = optionIndexRef.current++;
        return (
          <SelectOptionItem
            classNames={classNames}
            index={currentIndex}
            itemTextClassName={itemTextClassName}
            key={`${String(item.value)}-${currentIndex}`}
            listItemHeight={listItemHeight}
            option={item}
            optionRender={optionRender}
          />
        );
      })}
    </>
  );
};
