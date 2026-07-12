import { motion } from 'motion/react';
import type { PropsWithChildren } from 'react';

import ConfigProvider from '@/ConfigProvider';
import ThemeProvider from '@/ThemeProvider';

import type { DemoAppearance } from '../../types/demo';

interface DemoEnvironmentProps extends PropsWithChildren {
  appearance: DemoAppearance;
  demoId: string;
}

export default function DemoEnvironment({ appearance, children, demoId }: DemoEnvironmentProps) {
  return (
    <ConfigProvider motion={motion}>
      <ThemeProvider
        appId={`lobe-demo-${demoId}`}
        appearance={appearance}
        enableGlobalStyle={false}
      >
        {children}
      </ThemeProvider>
    </ConfigProvider>
  );
}
