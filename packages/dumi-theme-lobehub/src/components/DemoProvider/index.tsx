import { ConfigProvider } from 'antd';
import type { FC, PropsWithChildren } from 'react';

interface DemoProviderProps extends PropsWithChildren {
  inherit?: boolean;
}
const DemoProvider: FC<DemoProviderProps> = ({ children, inherit = false }) => {
  return (
    <ConfigProvider prefixCls={inherit ? 'ant' : undefined} theme={{ inherit }}>
      {children}
    </ConfigProvider>
  );
};

export default DemoProvider;
