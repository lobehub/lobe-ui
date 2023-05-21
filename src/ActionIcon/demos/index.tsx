import { Space } from 'antd';
import { ActionIcon } from 'lobe-ui';
import { Settings } from 'lucide-react';

export default () => {
  return (
    <Space>
      <ActionIcon icon={Settings} size="large" active />
      <ActionIcon icon={Settings} size="large" />
      <ActionIcon icon={Settings} />
      <ActionIcon icon={Settings} size="small" />
      <ActionIcon
        icon={Settings}
        size={{
          blockSize: 40,
          fontSize: 24,
          strokeWidth: 2,
          borderRadius: 20,
        }}
      />
    </Space>
  );
};
