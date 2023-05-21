import { Space } from 'antd';
import { Logo } from 'lobe-ui';

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
