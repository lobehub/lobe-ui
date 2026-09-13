import { Flexbox } from '@lobehub/ui';
import { Progress } from '@lobehub/ui/base-ui';

export default () => {
  return (
    <Flexbox gap={24} padding={16}>
      <Flexbox gap={12}>
        <Progress label="Uploading skill.zip" percent={62} />
        <Progress label="Indexing" percent={100} status="success" />
        <Progress label="Export" percent={33} status="exception" />
        <Progress label="Syncing" percent={48} status="active" />
      </Flexbox>
      <Flexbox gap={12}>
        <Progress percent={62} variant="segments" />
        <Progress percent={100} status="success" variant="segments" />
        <Progress percent={33} status="exception" variant="segments" />
      </Flexbox>
      <Flexbox gap={12}>
        <Progress percent={62} variant="inset" />
        <Progress percent={48} status="active" variant="inset" />
        <Progress percent={100} status="success" variant="inset" />
      </Flexbox>
      <Flexbox horizontal align="center" gap={16}>
        <Progress percent={62} size="small" type="circle" />
        <Progress percent={62} size="middle" type="circle" />
        <Progress percent={62} size="large" type="circle" />
        <Progress percent={100} status="success" type="circle" />
      </Flexbox>
    </Flexbox>
  );
};
