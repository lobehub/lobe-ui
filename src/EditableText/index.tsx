import { Edit3 } from 'lucide-react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ControlInput, ControlInputProps } from '@/components/ControlInput';
import { ActionIcon } from '@/index';

export type EditableTextProps = ControlInputProps;

const EditableText = memo<EditableTextProps>(({ value, onChange }: ControlInputProps) => {
  const [edited, setEdited] = useState(false);

  return edited ? (
    <ControlInput
      onChange={onChange}
      onChangeEnd={() => {
        setEdited(false);
      }}
      value={value as string}
    />
  ) : (
    <Flexbox gap={8} horizontal>
      {value}
      <ActionIcon
        icon={Edit3}
        onClick={() => {
          setEdited(!edited);
        }}
        placement="right"
        size="small"
        title={'Edit'}
      />
    </Flexbox>
  );
});

export default EditableText;
