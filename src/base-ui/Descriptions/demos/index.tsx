import { Flexbox } from '@lobehub/ui';
import { ActionIcon, Descriptions } from '@lobehub/ui/base-ui';
import { DownloadIcon } from 'lucide-react';

export default () => {
  return (
    <Flexbox gap={32} padding={16}>
      <Descriptions
        column={2}
        items={[
          { children: '3,482', label: 'Words' },
          { children: 'jina', label: 'Crawler' },
          { children: '18,904', label: 'Chars' },
          { children: '1–212', label: 'Lines' },
        ]}
      />
      <Descriptions
        colon={false}
        extra={<ActionIcon icon={DownloadIcon} title="Download" />}
        styles={{ label: { width: 120 } }}
        title="Basic info"
        items={[
          { children: 'quarterly-report.pdf', label: 'File name' },
          { children: '2.4 MB', label: 'Size' },
          { children: '2026-09-24 14:03', label: 'Uploaded' },
        ]}
      />
      <Descriptions
        bordered
        items={[
          { children: 'GitHub Token', label: 'Name' },
          { children: 'ghp_••••••••3kQ', label: 'Key' },
          { children: 'OAuth', label: 'Type' },
        ]}
      />
    </Flexbox>
  );
};
