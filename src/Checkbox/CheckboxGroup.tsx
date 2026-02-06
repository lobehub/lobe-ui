import type { FC } from 'react';
import useMergeState from 'use-merge-value';

import { Flexbox } from '@/Flex';

import Checkbox from './Checkbox';
import type { CheckboxGroupProps } from './type';

const CheckboxGroup: FC<CheckboxGroupProps> = ({
  defaultValue,
  disabled,
  onChange,
  options,
  textProps,
  value,
  shape,
  size,
  ...rest
}) => {
  const [selectedValues, setSelectedValues] = useMergeState<string[]>(defaultValue || [], {
    defaultValue,
    onChange,
    value,
  });

  const handleChange = (optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter((v) => v !== optionValue);

    setSelectedValues(newValues);
  };

  const normalizedOptions = options.map((option) => {
    if (typeof option === 'string') {
      return {
        disabled: false,
        label: option,
        value: option,
      };
    }
    return option;
  });

  return (
    <Flexbox horizontal align={'center'} gap={16} wrap={'wrap'} {...rest}>
      {normalizedOptions.map((option) => {
        const isChecked = selectedValues.includes(option.value);
        const isDisabled = disabled || option.disabled;

        return (
          <Checkbox
            checked={isChecked}
            disabled={isDisabled}
            key={String(option.value)}
            shape={shape}
            size={size}
            textProps={textProps}
            onChange={(checked) => handleChange(option.value, checked)}
          >
            {option.label}
          </Checkbox>
        );
      })}
    </Flexbox>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
