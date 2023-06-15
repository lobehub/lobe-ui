import { Features, FeaturesProps } from '@lobehub/ui';

const items: FeaturesProps['items'] = [
  {
    icon: 'Palette',
    title: 'Themeable',
    description:
      'Provides a simple way to customize default themes, you can change the colors, fonts, breakpoints and everything you need.',
  },
  {
    icon: 'Zap',
    title: 'Fast',
    description:
      'voids unnecessary styles props at runtime, making it more performant than other UI libraries.',
  },
  {
    icon: 'MoonStar',
    title: 'Light & Dark UI',
    description:
      'Automatic dark mode recognition, NextUI automatically changes the theme when detects HTML theme prop changes.',
  },
];

export default () => {
  return <Features items={items} />;
};
