import { Center, Highlighter, Snippet } from '@lobehub/ui';
import { Features, FeaturesProps } from '@lobehub/ui/awesome';
import { cssVar, responsive, useTheme } from 'antd-style';
import { MoonStar, Palette, Zap } from 'lucide-react';

const items: FeaturesProps['items'] = [
  {
    description:
      'Provides a simple way to customize default themes, you can change the colors, fonts, breakpoints and everything you need.',
    icon: Palette,
    title: 'Themeable',
  },
  {
    description:
      'voids unnecessary styles props at runtime, making it more performant than other UI libraries.',
    icon: Zap,
    title: 'Fast',
  },
  {
    description:
      'Automatic dark mode recognition, NextUI automatically changes the theme when detects HTML theme prop changes.',
    icon: MoonStar,
    title: 'Light & Dark UI',
  },
];

const example = `import { ThemeProvider, Button, I18nProvider } from '@lobehub/ui'
import allResources from '@lobehub/ui/i18n/resources/all'

export default () => (
  <I18nProvider resources={allResources}>
    <ThemeProvider>
      <Button>Hello AIGC</Button>
    </ThemeProvider>
  </I18nProvider>
)`;

export default () => {
  const theme = useTheme();

  console.log('responsive', responsive);
  console.log('cssVar', cssVar);

  return (
    <Center
      gap={48}
      style={{ maxWidth: 960, overflow: 'hidden', position: 'relative', width: '100%' }}
    >
      <Center>
        <h2 style={{ fontSize: 20, textAlign: 'center' }}>Start building your AIGC app now</h2>
        <Snippet language={'bash'}>{'$ bun add @lobehub/ui'}</Snippet>
        <p style={{ color: theme.colorTextSecondary, textAlign: 'center' }}>
          The Lobe UI components are developed based on{' '}
          <a href={'https://ant.design/components/overview'} rel="noreferrer" target={'_blank'}>
            Antd components
          </a>
          , fully compatible with Antd components, <br />
          and it is recommended to use{' '}
          <a href={'https://ant-design.github.io/antd-style'} rel="noreferrer" target={'_blank'}>
            antd-style
          </a>{' '}
          as the default css-in-js styling solution.
        </p>
      </Center>
      <Highlighter language={'tsx'} style={{ background: theme.colorFillTertiary, width: '100%' }}>
        {example}
      </Highlighter>
      <Features items={items} />
    </Center>
  );
};
