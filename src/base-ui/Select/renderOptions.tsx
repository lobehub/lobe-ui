'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { cx } from 'antd-style';
import { Check } from 'lucide-react';
import { type ComponentProps } from 'react';

import Icon from '@/Icon';
import { styles as menuStyles } from '@/Menu/sharedStyle';

import { getOptionSearchText, isGroupOption } from './helpers';
import { styles } from './style';
import {
  type SelectClassNames,
  type SelectOption,
  type SelectOptions,
  type SelectProps,
} from './type';

interface RenderOptionsParams {
  classNames: SelectClassNames | undefined;
  isBoldIndicator: boolean;
  items: SelectOptions<any>;
  itemTextClassName: string;
  listItemHeight: number | undefined;
  optionRender: SelectProps['optionRender'];
  renderVirtualItem: NonNullable<ComponentProps<typeof BaseSelect.Item>['render']>;
  virtual: boolean | undefined;
}

function renderItem(
  option: SelectOption<any>,
  index: number,
  params: Omit<RenderOptionsParams, 'items'>,
) {
  const {
    classNames,
    isBoldIndicator,
    itemTextClassName,
    listItemHeight,
    optionRender,
    renderVirtualItem,
    virtual,
  } = params;

  return (
    <BaseSelect.Item
      disabled={option.disabled}
      key={`${String(option.value)}-${index}`}
      label={getOptionSearchText(option)}
      render={virtual ? renderVirtualItem : undefined}
      value={option.value}
      className={cx(
        menuStyles.item,
        styles.item,
        isBoldIndicator && styles.itemBoldSelected,
        classNames?.item,
        classNames?.option,
        option.className,
      )}
      style={{
        minHeight: listItemHeight,
        ...option.style,
      }}
    >
      <BaseSelect.ItemText className={itemTextClassName}>
        {optionRender ? optionRender(option, { index }) : option.label}
      </BaseSelect.ItemText>
      {!isBoldIndicator && (
        <BaseSelect.ItemIndicator className={cx(styles.itemIndicator, classNames?.itemIndicator)}>
          <Icon icon={Check} size={'small'} />
        </BaseSelect.ItemIndicator>
      )}
    </BaseSelect.Item>
  );
}

export function renderOptions(params: RenderOptionsParams) {
  const { classNames, items } = params;
  let optionIndex = 0;

  return items.map((item, index) => {
    if (isGroupOption(item)) {
      return (
        <BaseSelect.Group className={cx(styles.group, classNames?.group)} key={`group-${index}`}>
          <BaseSelect.GroupLabel
            className={cx(menuStyles.groupLabel, styles.groupLabel, classNames?.groupLabel)}
          >
            {item.label}
          </BaseSelect.GroupLabel>
          {item.options.map((option) => renderItem(option, optionIndex++, params))}
        </BaseSelect.Group>
      );
    }

    return renderItem(item, optionIndex++, params);
  });
}
