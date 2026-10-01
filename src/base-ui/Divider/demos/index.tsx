import { Flexbox } from '@lobehub/ui';
import { Divider } from '@lobehub/ui/base-ui';

export default () => {
  return (
    <Flexbox gap={24} padding={16}>
      <Flexbox>
        <div style={{ padding: '10px 0' }}>Model provider</div>
        <Divider />
        <div style={{ padding: '10px 0' }}>Default model</div>
        <Divider dashed />
        <div style={{ padding: '10px 0' }}>Context window</div>
      </Flexbox>
      <Flexbox horizontal align="center" gap={12}>
        <span>Copy</span>
        <Divider orientation="vertical" />
        <span>Edit</span>
        <Divider orientation="vertical" />
        <span>Delete</span>
      </Flexbox>
      <Divider>OR</Divider>
    </Flexbox>
  );
};
