import { ControlInput, ControlInputProps } from '@/components/ControlInput';
import { ActionIcon } from '@/index';
import { Edit3 } from 'lucide-react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

export type EditableTextProps = ControlInputProps;

const EditableText = memo<EditableTextProps>(({ value, onChange }: ControlInputProps) => {
  const [edited, setEdited] = useState(false);
  return edited ? (
    <ControlInput
      value={value as string}
      onChangeEnd={() => {
        setEdited(false);
      }}
      onChange={onChange}
    />
  ) : (
    <Flexbox horizontal gap={8}>
      {value}
      <ActionIcon
        title={'Edit'}
        placement="right"
        icon={Edit3}
        size="small"
        onClick={() => {
          setEdited(!edited);
        }}
      />
    </Flexbox>
  );
});

export default EditableText;
