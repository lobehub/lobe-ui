import { useTheme } from 'antd-style';
import mermaid from 'mermaid';
import { useCallback, useEffect, useState } from 'react';

export const useMermaid = (content: string) => {
  const [mermaidContent, setMermaidContent] = useState<string>();
  const theme = useTheme();
  useEffect(() => {
    mermaid.initialize({
      fontFamily: theme.fontFamilyCode,
      gantt: {
        useWidth: 1920,
      },
      securityLevel: 'loose',
      startOnLoad: true,
      theme: theme.isDarkMode ? 'dark' : 'default',
      themeVariables: {
        errorBkgColor: theme.colorError,
        errorTextColor: theme.colorText,
        fontSize: 14,
        lineColor: theme.colorText,
        primaryBorderColor: theme.colorPrimaryBorder,
        primaryColor: theme.colorPrimaryBg,
        primaryTextColor: theme.colorText,
        secondaryColor: theme.colorInfo,
        tertiaryColor: theme.colorSuccess,
      },
    });
    mermaid.contentLoaded();
  }, [mermaidContent, theme.isDarkMode]);

  const checkSyntax = async (textStr: string) => {
    try {
      if (await mermaid.parse(textStr)) {
        setMermaidContent(textStr);
      }
    } catch {}
  };

  useEffect(() => {
    checkSyntax(content);
  }, [content]);

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
        {mermaidContent}
      </pre>
    );
  }, [mermaidContent, theme.isDarkMode]);
};
