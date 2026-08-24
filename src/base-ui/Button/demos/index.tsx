import { Flexbox } from '@lobehub/ui';
import { Button } from '@lobehub/ui/base-ui';
import { Trash2 } from 'lucide-react';

export default () => (
  <Flexbox gap={20} padding={16}>
    <Flexbox gap={8}>
      <span style={{ fontSize: 12, opacity: 0.6 }}>Type</span>
      <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="fill">Fill</Button>
        <Button type="text">Text</Button>
        <Button type="link">Link</Button>
      </Flexbox>
    </Flexbox>

    <Flexbox gap={8}>
      <span style={{ fontSize: 12, opacity: 0.6 }}>Danger</span>
      <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
        <Button danger type="primary">
          Delete
        </Button>
        <Button danger>Delete</Button>
        <Button danger type="dashed">
          Delete
        </Button>
        <Button danger type="fill">
          Delete
        </Button>
        <Button danger type="text">
          Delete
        </Button>
        <Button danger type="link">
          Delete
        </Button>
      </Flexbox>
    </Flexbox>

    <Flexbox gap={8}>
      <span style={{ fontSize: 12, opacity: 0.6 }}>Ghost (no fill, no border)</span>
      <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
        <Button ghost type="primary">
          Primary
        </Button>
        <Button ghost>Default</Button>
        <Button danger ghost>
          Danger
        </Button>
        <Button danger ghost icon={Trash2} shape="circle" />
      </Flexbox>
    </Flexbox>

    <Flexbox gap={8}>
      <span style={{ fontSize: 12, opacity: 0.6 }}>Disabled</span>
      <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
        <Button disabled type="primary">
          Primary
        </Button>
        <Button disabled>Default</Button>
        <Button disabled type="dashed">
          Dashed
        </Button>
        <Button disabled type="text">
          Text
        </Button>
        <Button disabled type="link">
          Link
        </Button>
      </Flexbox>
    </Flexbox>
  </Flexbox>
);
