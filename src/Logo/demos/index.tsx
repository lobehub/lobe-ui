import { Logo } from '@lobehub/ui';
import { Space } from 'antd';

export default () => {
  return (
    <Space>
      <Logo type="3d" size={128} />
      <Logo type="flat" size={48} />
      <Logo type="high-contrast" size={24} />
      <Logo type="text" size={128} />
    </Space>
  );
};
