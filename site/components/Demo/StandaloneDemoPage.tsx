import type { DemoAppearance, DemoModule } from '../../types/demo';
import { CanonicalPreview } from './CanonicalPreview';
import { styles } from './style';

interface StandaloneDemoPageProps {
  appearance?: DemoAppearance;
  demo: DemoModule;
  metadataRouteId?: string;
  requestedRouteId?: string;
}

export function StandaloneDemoPage({
  appearance = 'light',
  demo,
  metadataRouteId,
  requestedRouteId,
}: StandaloneDemoPageProps) {
  return (
    <main
      className={styles.standalonePage}
      data-demo-appearance={appearance}
      data-demo-route-id={metadataRouteId}
      data-requested-route-id={requestedRouteId}
      data-standalone-demo=""
      id="standalone-demo-content"
    >
      <CanonicalPreview appearance={appearance} demo={demo} />
    </main>
  );
}
