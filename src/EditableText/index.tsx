'use client';

import { Edit3 } from 'lucide-react';
import { memo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Flexbox, FlexboxProps } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';

import ControlInput, { type ControlInputProps } from './ControlInput';

export interface EditableTextProps extends Omit<FlexboxProps, 'onChange'> {
  editing?: boolean;
  inputProps?: Omit<ControlInputProps, 'onChange' | 'value'>;
  onChange?: ControlInputProps['onChange'];
  onEditingChange?: (editing: boolean) => void;
  showEditIcon?: boolean;
  value?: ControlInputProps['value'];
}

const EditableText = memo<EditableTextProps>(
  ({
    value,
    showEditIcon = true,
    onChange,
    editing,
    onEditingChange,
    inputProps,
    gap = 8,
    style,
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

    const input = (
      <ControlInput
        onChange={onChange}
        onChangeEnd={() => {
          setEdited(false);
        }}
        value={value as string}
        {...inputProps}
      />
    );

    const content = (
      <>
        <span>{value}</span>
        {showEditIcon && (
          <ActionIcon
            icon={Edit3}
            onClick={() => {
              setEdited(!edited);
            }}
            size="small"
            title={'Edit'}
          />
        )}
      </>
    );

    return (
      <Flexbox
        align={'center'}
        gap={gap}
        horizontal
        style={{
          minHeight: 38,
          ...style,
        }}
        {...rest}
      >
        {edited ? input : content}
      </Flexbox>
    );
  },
);

export default EditableText;
