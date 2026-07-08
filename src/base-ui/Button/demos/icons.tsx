import { Flexbox } from '@lobehub/ui';
import { Button } from '@lobehub/ui/base-ui';
import { ArrowRight, Download, Search, Settings, Trash } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [loading, setLoading] = useState(false);

  const trigger = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1600);
  };

  return (
    <Flexbox gap={20} padding={16}>
      <Flexbox gap={8}>
        <span style={{ fontSize: 12, opacity: 0.6 }}>Icon</span>
        <Flexbox horizontal align="center" gap={8} style={{ flexWrap: 'wrap' }}>
          <Button icon={<Download size={14} />} type="primary">
            Download
          </Button>
          <Button icon={<Search size={14} />}>Search</Button>
          <Button icon={<ArrowRight size={14} />} iconPosition="end" type="primary">
            Continue
          </Button>
          <Button icon={Trash}>Bare icon component</Button>
        </Flexbox>
      </Flexbox>

      <Flexbox gap={8}>
        <span style={{ fontSize: 12, opacity: 0.6 }}>Icon only</span>
        <Flexbox horizontal align="center" gap={8} style={{ flexWrap: 'wrap' }}>
          <Button icon={<Settings size={14} />} size="small" />
          <Button icon={<Settings size={14} />} />
          <Button icon={<Settings size={14} />} size="large" />
          <Button danger icon={<Trash size={14} />} type="primary" />
          <Button icon={<Settings size={14} />} shape="circle" type="primary" />
        </Flexbox>
      </Flexbox>

      <Flexbox gap={8}>
        <span style={{ fontSize: 12, opacity: 0.6 }}>Loading</span>
        <Flexbox horizontal align="center" gap={8} style={{ flexWrap: 'wrap' }}>
          <Button loading={loading} type="primary" onClick={trigger}>
            Submit
          </Button>
          <Button loading={loading} onClick={trigger}>
            Save draft
          </Button>
          <Button loading icon={<Download size={14} />} type="primary">
            Downloading
          </Button>
          <Button loading shape="circle" />
        </Flexbox>
      </Flexbox>

      <Flexbox gap={8}>
        <span style={{ fontSize: 12, opacity: 0.6 }}>Link (href)</span>
        <Flexbox horizontal align="center" gap={8} style={{ flexWrap: 'wrap' }}>
          <Button href="https://lobehub.com" target="_blank" type="link">
            Visit LobeHub
          </Button>
          <Button href="https://lobehub.com" target="_blank">
            Open
          </Button>
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
};
