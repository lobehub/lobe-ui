import { CheckIcon } from 'lucide-react';
import type { CSSProperties, FC } from 'react';
import useMergeState from 'use-merge-value';

import Block from '@/Block';
import { Flexbox } from '@/Flex';
import Text from '@/Text';

import { useStyles } from './style';
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
  ...rest
}) => {
  const { styles, cx } = useStyles();
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

  const handleClick = () => {
    if (!disabled) {
      setValue(!value);
    }
  };

  const checkIcon = (
    <Block
      align={'center'}
      className={cx(
        styles.root,
        value && styles.checked,
        disabled && styles.disabled,
        className,
        classNames?.checkbox,
      )}
      flex={'none'}
      height={size}
      justify={'center'}
      onClick={handleClick}
      style={
        backgroundColor && value
          ? { backgroundColor, borderColor: backgroundColor, ...checkboxStyles }
          : { ...checkboxStyles }
      }
      variant={'outlined'}
      width={size}
      {...rest}
    >
      {value ? (
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
      align={'center'}
      className={classNames?.wrapper}
      gap={Math.floor(size / 2)}
      horizontal
      style={customStyles?.wrapper}
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
