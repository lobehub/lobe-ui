import { ForwardedRef, forwardRef, memo } from 'react';

import { useStyles } from './style';

interface SelectItemProps {
  disabled?: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  label: any;
  prefixCls: string;
  ref?: ForwardedRef<HTMLButtonElement>;
  value: any;
}

const SelectItem = memo<SelectItemProps>(
  forwardRef(({ value, label, prefixCls, isSelected, isActive, disabled, ...props }, reference) => {
    const { styles, cx } = useStyles(prefixCls);

    return (
      <button
        aria-selected={isSelected}
        className={cx(styles.item, {
          [styles.selected]: isSelected,
          [styles.active]: isActive,
        })}
        disabled={disabled}
        key={value}
        ref={reference}
        role="option"
        tabIndex={-1}
        type={'button'}
        {...props}
      >
        {label}
      </button>
    );
  }),
);

export default SelectItem;
