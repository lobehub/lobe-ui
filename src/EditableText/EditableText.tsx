'use client';

import { cx } from 'antd-style';
import { Edit3 } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import useControlledState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';

import ControlInput from './ControlInput';
import type { EditableTextProps } from './type';

const EditableText = memo<EditableTextProps>(
  ({
    value,
    showEditIcon = true,
    onChange,
    editing,
    onEditingChange,
    onChangeEnd,
    onFocus,
    onBlur,
    className,
    inputProps,
    onValueChanging,
    gap = 8,
    style,
    size = 'small',
    styles,
    classNames,
    variant = 'borderless',
    ...rest
  }) => {
    const [edited, setEdited] = useControlledState(false, {
      onChange: onEditingChange,
      value: editing,
    });

    useHotkeys(
      'esc',
      () => {
        setEdited(false);
      },
      {
        enableOnFormTags: true,
        enabled: edited,
        preventDefault: true,
      },
    );

    const height = useMemo(() => {
      if (!size) return 32;
      switch (size) {
        case 'large': {
          return 40;
        }
        case 'middle': {
          return 32;
        }
        case 'small': {
          return 24;
        }
      }
    }, [size]);

    const input = (
      <ControlInput
        className={cx(className, classNames?.input)}
        size={size}
        value={value as string}
        variant={variant}
        style={{
          height,
          ...style,
          ...styles?.input,
        }}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onValueChanging={onValueChanging}
        onChangeEnd={(v) => {
          onChangeEnd?.(v);
          setEdited(false);
        }}
        {...inputProps}
      />
    );

    const content = (
      <>
        <span>{value}</span>
        {showEditIcon && (
          <ActionIcon
            icon={Edit3}
            size="small"
            title={'Edit'}
            onClick={() => {
              setEdited(!edited);
            }}
          />
        )}
      </>
    );

    return (
      <Flexbox
        horizontal
        align={'center'}
        className={cx(className, classNames?.container)}
        gap={gap}
        style={{
          height,
          width: '100%',
          ...style,
          ...styles?.container,
        }}
        {...rest}
      >
        {edited ? input : content}
      </Flexbox>
    );
  },
);

EditableText.displayName = 'EditableText';

export default EditableText;
