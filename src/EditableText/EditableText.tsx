'use client';

import { Edit3 } from 'lucide-react';
import { memo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';

import ControlInput from './ControlInput';
import type { EditableTextProps } from './type';

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

EditableText.displayName = 'EditableText';

export default EditableText;
