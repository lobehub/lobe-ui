import { useTheme } from 'antd-style';
import mermaid from 'mermaid';
import { useCallback, useEffect } from 'react';

export const useMermaid = (content: string) => {
  const theme = useTheme();
  useEffect(() => {
    mermaid.initialize({
      fontFamily: theme.fontFamilyCode,
      securityLevel: 'loose',
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        fontSize: 14,
        lineColor: theme.colorBorderSecondary,
        primaryBorderColor: theme.colorPrimaryBorder,
        primaryColor: theme.colorPrimaryBg,
        primaryTextColor: theme.colorText,
        secondaryColor: theme.colorInfo,
        tertiaryColor: theme.colorSuccess,
      },
    });
    mermaid.contentLoaded();
  }, [content, theme.isDarkMode]);

  return useCallback(() => {
    return (
      <pre
        className={'mermaid'}
        style={{
          alignItems: 'center',
          display: 'flex',
          fontSize: 14,
          justifyContent: 'center',
          overflow: 'auto',
        }}
      >
        {content}
      </pre>
    );
  }, [content, theme.isDarkMode]);
};
