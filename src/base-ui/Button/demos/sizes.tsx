import { Flexbox } from '@lobehub/ui';
import { Button } from '@lobehub/ui/base-ui';

export default () => (
  <Flexbox gap={20} padding={16}>
    <Flexbox gap={8}>
      <span style={{ fontSize: 12, opacity: 0.6 }}>Size</span>
      <Flexbox horizontal align="center" gap={8} style={{ flexWrap: 'wrap' }}>
        <Button size="small" type="primary">
          Small
        </Button>
        <Button size="middle" type="primary">
          Middle
        </Button>
        <Button size="large" type="primary">
          Large
        </Button>
      </Flexbox>
      <Flexbox horizontal align="center" gap={8} style={{ flexWrap: 'wrap' }}>
        <Button size="small">Small</Button>
        <Button size="middle">Middle</Button>
        <Button size="large">Large</Button>
      </Flexbox>
    </Flexbox>

    <Flexbox gap={8}>
      <span style={{ fontSize: 12, opacity: 0.6 }}>Shape</span>
      <Flexbox horizontal align="center" gap={8} style={{ flexWrap: 'wrap' }}>
        <Button shape="default" type="primary">
          Default
        </Button>
        <Button shape="round" type="primary">
          Round
        </Button>
        <Button shape="round">Round</Button>
      </Flexbox>
    </Flexbox>

    <Flexbox gap={8}>
      <span style={{ fontSize: 12, opacity: 0.6 }}>Block</span>
      <Button block type="primary">
        Sign in
      </Button>
      <Button block>Continue with Google</Button>
    </Flexbox>
  </Flexbox>
);
