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
      theme: theme.isDarkMode ? 'dark' : 'neutral',
      themeVariables: {
        errorBkgColor: theme.colorErrorBg,
        errorTextColor: theme.colorErrorText,
        fontFamily: theme.fontFamily,
        fontSize: 14,
        lineColor: theme.colorTextSecondary,
        mainBkg: theme.colorBgContainer,
        noteBkgColor: theme.colorInfoBg,
        noteTextColor: theme.colorInfoText,
        pie1: theme.geekblue,
        pie2: theme.colorWarning,
        pie3: theme.colorSuccess,
        pie4: theme.colorError,
        primaryBorderColor: theme.colorBorder,
        primaryColor: theme.colorBgContainer,
        primaryTextColor: theme.colorText,
        secondaryBorderColor: theme.colorInfoBorder,
        secondaryColor: theme.colorInfoBg,
        secondaryTextColor: theme.colorInfoText,
        tertiaryBorderColor: theme.colorSuccessBorder,
        tertiaryColor: theme.colorSuccessBg,
        tertiaryTextColor: theme.colorSuccessText,
        textColor: theme.colorText,
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
