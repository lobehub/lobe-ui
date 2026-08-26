import { Flexbox, Tag } from '@lobehub/ui';
import { XIcon } from 'lucide-react';

export default () => {
  return (
    <Flexbox gap={8} padding={16}>
      <Flexbox horizontal gap={8} wrap="wrap">
        <Tag closable color="blue">
          closable
        </Tag>
        <Tag closable closeIcon={<XIcon size={12} />} color="green">
          custom close icon
        </Tag>
        <Tag closable color="#eb2f96">
          hex closable
        </Tag>
      </Flexbox>
    </Flexbox>
  );
};
