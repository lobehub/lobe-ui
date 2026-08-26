import { Flexbox } from '@lobehub/ui';
import { ActionIcon } from '@lobehub/ui/base-ui';
import { Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [loading, setLoading] = useState(false);

  return (
    <Flexbox gap={16} padding={16}>
      <Flexbox gap={8}>
        <strong>Size</strong>
        <Flexbox horizontal gap={16} wrap={'wrap'}>
          <ActionIcon icon={Settings} size={'small'} />
          <ActionIcon icon={Settings} size={'middle'} />
          <ActionIcon icon={Settings} size={'large'} />
          <ActionIcon icon={Settings} size={32} />
        </Flexbox>
      </Flexbox>
      <Flexbox gap={8}>
        <strong>Variant</strong>
        <Flexbox horizontal gap={16} wrap={'wrap'}>
          <ActionIcon icon={Settings} />
          <ActionIcon icon={Settings} variant={'filled'} />
          <ActionIcon icon={Settings} variant={'outlined'} />
          <ActionIcon shadow icon={Settings} variant={'outlined'} />
        </Flexbox>
      </Flexbox>
      <Flexbox gap={8}>
        <strong>States</strong>
        <Flexbox horizontal gap={16} wrap={'wrap'}>
          <ActionIcon active icon={Settings} title="Active" />
          <ActionIcon danger icon={Trash2} title="Danger" />
          <ActionIcon disabled icon={Settings} title="Disabled" />
          <ActionIcon glass icon={Settings} title="Glass" />
          <ActionIcon
            icon={Settings}
            loading={loading}
            title="Toggle loading"
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1500);
            }}
          />
        </Flexbox>
      </Flexbox>
      <Flexbox gap={8}>
        <strong>Custom size</strong>
        <Flexbox horizontal gap={16} wrap={'wrap'}>
          <ActionIcon icon={Settings} size={{ blockSize: 48, borderRadius: 12 }} />
          <ActionIcon icon={Settings} size={{ blockSize: 40 }} />
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
};
