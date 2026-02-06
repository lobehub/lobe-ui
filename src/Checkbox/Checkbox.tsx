import { cx } from 'antd-style';
import { CheckIcon, Minus } from 'lucide-react';
import type { CSSProperties, FC, MouseEvent } from 'react';
import useMergeState from 'use-merge-value';

import Block from '@/Block';
import { Flexbox } from '@/Flex';
import Text from '@/Text';

import { styles } from './style';
import type { CheckboxProps } from './type';

const Checkbox: FC<CheckboxProps> = ({
  checked,
  defaultChecked,
  onChange,
  size = 16,
  className,
  style,
  children,
  textProps,
  backgroundColor,
  classNames,
  styles: customStyles,
  shape = 'square',
  disabled,
  indeterminate,
  ...rest
}) => {
  const [value, setValue] = useMergeState(defaultChecked || false, {
    defaultValue: defaultChecked,
    onChange,
    value: checked,
  });

  const checkboxStyles: CSSProperties = {
    borderRadius: shape === 'square' ? `max(4px, ${Math.round(size / 4)}px)` : '50%',
    ...style,
    ...customStyles?.checkbox,
  };

  const handleClick = (e?: MouseEvent) => {
    if (!disabled) {
      e?.preventDefault();
      setValue(!value);
    }
  };

  const isIndeterminate = indeterminate;
  const isChecked = !isIndeterminate && value;

  const checkIcon = (
    <Block
      align={'center'}
      flex={'none'}
      height={size}
      justify={'center'}
      variant={'outlined'}
      width={size}
      className={cx(
        styles.root,
        isChecked && styles.checked,
        isIndeterminate && styles.indeterminate,
        disabled && styles.disabled,
        className,
        classNames?.checkbox,
      )}
      style={
        backgroundColor && (isChecked || isIndeterminate)
          ? { backgroundColor, borderColor: backgroundColor, ...checkboxStyles }
          : { ...checkboxStyles }
      }
      onClick={handleClick}
      {...rest}
    >
      {isIndeterminate ? (
        <Minus
          size={size}
          strokeWidth={3}
          style={{
            transform: `scale(${shape === 'square' ? 0.75 : 0.66})`,
          }}
        />
      ) : isChecked ? (
        <CheckIcon
          size={size}
          strokeWidth={3}
          style={{
            transform: `scale(${shape === 'square' ? 0.75 : 0.66})`,
          }}
        />
      ) : null}
    </Block>
  );

  if (!children) return checkIcon;

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={classNames?.wrapper}
      gap={Math.floor(size / 2)}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        ...customStyles?.wrapper,
      }}
      onClick={handleClick}
    >
      {checkIcon}
      <Text
        as={'span'}
        className={cx(classNames?.text)}
        style={customStyles?.text}
        {...textProps}
        type={disabled ? 'secondary' : textProps?.type}
      >
        {children}
      </Text>
    </Flexbox>
  );
};

Checkbox.displayName = 'Checkbox';

export default Checkbox;
