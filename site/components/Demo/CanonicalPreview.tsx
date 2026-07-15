import { lazy, Suspense, useEffect, useMemo, useState } from 'react';

import type { DemoAppearance, DemoModule } from '../../types/demo';
import DemoEnvironment from './DemoEnvironment';
import DemoErrorBoundary from './DemoErrorBoundary';
import { styles } from './style';

interface CanonicalPreviewProps {
  appearance?: DemoAppearance;
  demo: DemoModule;
}

function DemoPlaceholder() {
  return (
    <div
      aria-label="Loading demo preview"
      className={styles.placeholder}
      data-demo-placeholder=""
      role="status"
    >
      <span>Loading preview</span>
    </div>
  );
}

function LoadedDemo({ demo }: Pick<CanonicalPreviewProps, 'demo'>) {
  const DemoComponent = useMemo(() => lazy(async () => ({ default: await demo.load() })), [demo]);

  return (
    <Suspense fallback={<DemoPlaceholder />}>
      <DemoComponent />
    </Suspense>
  );
}

function HydratedPreview({ appearance, demo }: Required<CanonicalPreviewProps>) {
  return (
    <DemoErrorBoundary resetKey={demo.id}>
      <DemoEnvironment appearance={appearance} demoId={demo.id}>
        <LoadedDemo demo={demo} />
      </DemoEnvironment>
    </DemoErrorBoundary>
  );
}

export default function CanonicalPreview({ appearance = 'light', demo }: CanonicalPreviewProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? <HydratedPreview appearance={appearance} demo={demo} /> : <DemoPlaceholder />;
}
