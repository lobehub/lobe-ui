'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import clsx from 'clsx';
import { Check } from 'lucide-react';

import { menuStyles } from '@/DropdownMenu/sharedStyle';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';

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
}

function renderItem(
  option: SelectOption<any>,
  index: number,
  params: Omit<RenderOptionsParams, 'items'>,
) {
  const { classNames, isBoldIndicator, itemTextClassName, listItemHeight, optionRender } = params;

  return (
    <BaseSelect.Item
      disabled={option.disabled}
      key={`${String(option.value)}-${index}`}
      label={getOptionSearchText(option)}
      value={option.value}
      {...styleProps(
        [menuStyles.item, isBoldIndicator && styles.itemBoldSelected],
        clsx(classNames?.item, classNames?.option, option.className),
        { minHeight: listItemHeight, ...option.style },
      )}
    >
      <BaseSelect.ItemText className={itemTextClassName}>
        {optionRender ? optionRender(option, { index }) : option.label}
      </BaseSelect.ItemText>
      {!isBoldIndicator && (
        <BaseSelect.ItemIndicator {...styleProps(styles.itemIndicator, classNames?.itemIndicator)}>
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
        <BaseSelect.Group className={classNames?.group} key={`group-${index}`}>
          <BaseSelect.GroupLabel {...styleProps(menuStyles.groupLabel, classNames?.groupLabel)}>
            {item.label}
          </BaseSelect.GroupLabel>
          {item.options.map((option) => renderItem(option, optionIndex++, params))}
        </BaseSelect.Group>
      );
    }

    return renderItem(item, optionIndex++, params);
  });
}
