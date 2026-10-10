import { Center, Highlighter, Snippet, useTheme } from '@lobehub/ui';
import { Features, type FeaturesProps } from '@lobehub/ui/awesome';
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

const example = `import '@lobehub/ui/theme.css'

import { Button, ConfigProvider, I18nProvider } from '@lobehub/ui'
import allResources from '@lobehub/ui/i18n/resources/all'
import { motion } from 'motion/react'

export default () => (
  <I18nProvider resources={allResources}>
    <ConfigProvider motion={motion}>
      <Button>Hello AIGC</Button>
    </ConfigProvider>
  </I18nProvider>
)`;

export default () => {
  const theme = useTheme();

  return (
    <Center
      gap={48}
      style={{ maxWidth: 960, overflow: 'hidden', position: 'relative', width: '100%' }}
    >
      <Center>
        <h2 style={{ fontSize: 20, textAlign: 'center' }}>Start building your AIGC app now</h2>
        <Snippet language={'bash'}>{'$ pnpm add @lobehub/ui'}</Snippet>
        <p style={{ color: theme.colorTextSecondary, textAlign: 'center' }}>
          Import <code>@lobehub/ui/theme.css</code> once, wrap the app in{' '}
          <code>ConfigProvider</code>, and style with <code>createStaticStyles</code> /{' '}
          <code>cssVar</code> from <code>@lobehub/ui</code>.
        </p>
      </Center>
      <Highlighter language={'tsx'} style={{ width: '100%' }}>
        {example}
      </Highlighter>
      <Features items={items} />
    </Center>
  );
};
