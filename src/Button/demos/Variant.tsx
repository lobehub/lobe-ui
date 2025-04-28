import { Button } from '@lobehub/ui';
import { Divider } from 'antd';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox gap={16}>
      <Flexbox gap={16} horizontal wrap="wrap">
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
      </Flexbox>
      <Divider />
      <Flexbox gap={16} horizontal wrap="wrap">
        <Button color="default" variant="solid">
          Solid
        </Button>
        <Button color="default" variant="outlined">
          Outlined
        </Button>
        <Button color="default" variant="dashed">
          Dashed
        </Button>
        <Button color="default" variant="filled">
          Filled
        </Button>
        <Button color="default" variant="text">
          Text
        </Button>
        <Button color="default" variant="link">
          Link
        </Button>
      </Flexbox>
      <Flexbox gap={16} horizontal wrap="wrap">
        <Button color="danger" variant="solid">
          Solid
        </Button>
        <Button color="danger" variant="outlined">
          Outlined
        </Button>
        <Button color="danger" variant="dashed">
          Dashed
        </Button>
        <Button color="danger" variant="filled">
          Filled
        </Button>
        <Button color="danger" variant="text">
          Text
        </Button>
        <Button color="danger" variant="link">
          Link
        </Button>
      </Flexbox>
      <Flexbox gap={16} horizontal wrap="wrap">
        <Button color="pink" variant="solid">
          Solid
        </Button>
        <Button color="pink" variant="outlined">
          Outlined
        </Button>
        <Button color="pink" variant="dashed">
          Dashed
        </Button>
        <Button color="pink" variant="filled">
          Filled
        </Button>
        <Button color="pink" variant="text">
          Text
        </Button>
        <Button color="pink" variant="link">
          Link
        </Button>
      </Flexbox>
      <Flexbox gap={16} horizontal wrap="wrap">
        <Button color="purple" variant="solid">
          Solid
        </Button>
        <Button color="purple" variant="outlined">
          Outlined
        </Button>
        <Button color="purple" variant="dashed">
          Dashed
        </Button>
        <Button color="purple" variant="filled">
          Filled
        </Button>
        <Button color="purple" variant="text">
          Text
        </Button>
        <Button color="purple" variant="link">
          Link
        </Button>
      </Flexbox>
      <Flexbox gap={16} horizontal wrap="wrap">
        <Button color="cyan" variant="solid">
          Solid
        </Button>
        <Button color="cyan" variant="outlined">
          Outlined
        </Button>
        <Button color="cyan" variant="dashed">
          Dashed
        </Button>
        <Button color="cyan" variant="filled">
          Filled
        </Button>
        <Button color="cyan" variant="text">
          Text
        </Button>
        <Button color="cyan" variant="link">
          Link
        </Button>
      </Flexbox>
    </Flexbox>
  );
};
