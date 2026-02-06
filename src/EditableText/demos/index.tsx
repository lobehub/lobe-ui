import { EditableText } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState('editable text');

  return (
    <EditableText
      value={value}
      onChange={(v) => {
        console.log('changed', v);
        setValue(v);
      }}
    />
  );
};
