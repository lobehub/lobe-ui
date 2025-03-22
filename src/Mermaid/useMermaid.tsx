import { useTheme } from 'antd-style';
import mermaid from 'mermaid';
import { useCallback, useEffect, useState } from 'react';
import { Center } from 'react-layout-kit';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import Controls from './Controls';

export const useMermaid = (
  content: string,
  { enablePanZoom }: { enablePanZoom?: boolean } = {},
) => {
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
        errorBkgColor: theme.colorTextDescription,
        errorTextColor: theme.colorTextDescription,
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
    if (enablePanZoom) {
      return (
        <TransformWrapper>
          <Controls />
          <TransformComponent
            contentClass={'mermaid'}
            contentStyle={{
              padding: 16,
            }}
            wrapperStyle={{
              minHeight: 240,
              width: '100%',
            }}
          >
            {mermaidContent}
          </TransformComponent>
        </TransformWrapper>
      );
    }
    return (
      <Center as={'pre'} className={'mermaid'} padding={16}>
        {mermaidContent}
      </Center>
    );
  }, [mermaidContent, theme.isDarkMode, enablePanZoom]);
};
