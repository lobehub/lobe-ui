import { ConfigProvider, ThemeProvider } from '@lobehub/ui';
import { motion } from 'motion/react';
import type { CSSProperties, PropsWithChildren } from 'react';

import type { DemoAppearance } from '../../types/demo';

interface DemoEnvironmentProps extends PropsWithChildren {
  appearance: DemoAppearance;
  demoId: string;
}

export function DemoEnvironment({ appearance, children, demoId }: DemoEnvironmentProps) {
  return (
    <div data-lobe-demo-appearance={appearance} style={demoScopeStyle}>
      <ConfigProvider motion={motion}>
        <ThemeProvider
          appId={`lobe-demo-${demoId}`}
          appearance={appearance}
          enableGlobalStyle={false}
          style={demoAppStyle}
        >
          {children}
        </ThemeProvider>
      </ConfigProvider>
    </div>
  );
}

const demoScopeStyle: CSSProperties = { display: 'contents' };

// ThemeProvider isolates its <App> into its own stacking context. Nesting one per demo
// traps every floating layer the demo opens below the site header and TOC, so a drawer
// or popover renders underneath the chrome instead of above it.
const demoAppStyle: CSSProperties = { isolation: 'auto' };
