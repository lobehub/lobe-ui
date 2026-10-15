import { ConfigProvider, ThemeScope } from '@lobehub/ui';
import { motion } from 'motion/react';
import type { CSSProperties, PropsWithChildren } from 'react';

import type { DemoAppearance } from '../../types/demo';

interface DemoEnvironmentProps extends PropsWithChildren {
  appearance: DemoAppearance;
  demoId: string;
}

export function DemoEnvironment({ appearance, children, demoId }: DemoEnvironmentProps) {
  return (
    <div data-lobe-demo-appearance={appearance} id={`lobe-demo-${demoId}`} style={demoScopeStyle}>
      <ThemeScope appearance={appearance} style={demoScopeStyle}>
        <ConfigProvider enableCustomFonts={false} motion={motion}>
          {children}
        </ConfigProvider>
      </ThemeScope>
    </div>
  );
}

const demoScopeStyle: CSSProperties = { display: 'contents' };
