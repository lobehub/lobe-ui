import { Flexbox } from '@lobehub/ui';
import { Spin } from '@lobehub/ui/base-ui';
import { cssVar } from 'antd-style';

export default () => {
  return (
    <Flexbox gap={16} padding={16}>
      <Flexbox horizontal align="center" gap={16}>
        <Spin size="small" />
        <Spin size="middle" />
        <Spin size="large" />
      </Flexbox>
      <Flexbox horizontal align="center" gap={16}>
        <Spin percent={30} size="middle" />
        <Spin percent={72} size="large" />
      </Flexbox>
      <Flexbox horizontal align="center" gap={16}>
        <Spin variant="neural" />
      </Flexbox>
      <div
        style={{
          border: `1px dashed ${cssVar.colorBorderSecondary}`,
          borderRadius: 8,
          padding: 16,
        }}
      >
        <Spin tip="Loading…">
          <div style={{ height: 96 }}>content</div>
        </Spin>
      </div>
    </Flexbox>
  );
};
