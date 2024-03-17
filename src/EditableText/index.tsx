'use client';

import { Edit3 } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';
import { ControlInput, ControlInputProps } from '@/components/ControlInput';

export interface EditableTextProps extends ControlInputProps {
  editing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  showEditIcon?: boolean;
}

const EditableText = memo<EditableTextProps>(
  ({ value, showEditIcon = true, onChange, editing, onEditingChange, ...rest }) => {
    const [edited, setEdited] = useControlledState(false, {
      onChange: onEditingChange,
      value: editing,
    });

    return edited ? (
      <ControlInput
        onChange={onChange}
        onChangeEnd={() => {
          setEdited(false);
        }}
        value={value as string}
        {...rest}
      />
    ) : (
      <Flexbox gap={8} horizontal>
        {value}
        {showEditIcon && (
          <ActionIcon
            icon={Edit3}
            onClick={() => {
              setEdited(!edited);
            }}
            placement="right"
            size="small"
            title={'Edit'}
          />
        )}
      </Flexbox>
    );
  },
);

export default EditableText;
