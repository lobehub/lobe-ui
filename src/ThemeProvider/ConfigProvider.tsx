'use client';

import { ConfigProvider as AntdConfigProvider } from 'antd';
import { cssVar } from 'antd-style';
import { memo, type PropsWithChildren } from 'react';

const ConfigProvider = memo<PropsWithChildren>(({ children }) => {
  return (
    <AntdConfigProvider
      theme={{
        components: {
          Button: {
            contentFontSizeSM: 12,
          },
          DatePicker: {
            activeBorderColor: cssVar.colorBorder,
            hoverBorderColor: cssVar.colorBorder,
          },
          Input: {
            activeBorderColor: cssVar.colorBorder,
            hoverBorderColor: cssVar.colorBorder,
          },
          InputNumber: {
            activeBorderColor: cssVar.colorBorder,
            hoverBorderColor: cssVar.colorBorder,
          },
          Mentions: {
            activeBorderColor: cssVar.colorBorder,
            hoverBorderColor: cssVar.colorBorder,
          },
          Select: {
            activeBorderColor: cssVar.colorBorder,
            hoverBorderColor: cssVar.colorBorder,
          },
        },
      }}
    >
      {children}
    </AntdConfigProvider>
  );
});

export default ConfigProvider;
