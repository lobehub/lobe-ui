import { EditOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ControlInput, ControlInputProps } from './ControlInput';

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
      <Tooltip title={'编辑'}>
        <EditOutlined
          onClick={() => {
            setEdited(!edited);
          }}
        />
      </Tooltip>
    </Flexbox>
  );
});

export default EditableText;
