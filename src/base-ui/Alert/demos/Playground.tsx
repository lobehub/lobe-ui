import { Flexbox } from '@lobehub/ui';
import { Alert, type AlertType, type AlertVariant, Button } from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface PlaygroundControls {
  banner: boolean;
  closable: boolean;
  colorfulText: boolean;
  description: string;
  detailsExpanded: boolean;
  glass: boolean;
  showIcon: boolean;
  title: string;
  type: AlertType;
  variant: Exclude<AlertVariant, 'borderless' | 'filled'>;
  withAction: boolean;
  withDetails: boolean;
}

const diagnosticDetails = [
  ['Environment', 'Production'],
  ['Build', '2026.08.14-rc.3'],
  ['Request', 'req_7f9a2d'],
] as const;

export default () => {
  const store = useCreateStore();
  const [alertKey, setAlertKey] = useState(0);
  const control = useControls(
    {
      banner: false,
      closable: true,
      colorfulText: false,
      description: 'Review the release notes before promoting this build.',
      detailsExpanded: false,
      glass: false,
      showIcon: true,
      title: 'A new deployment is ready for review.',
      type: {
        label: 'Semantic tone',
        options: ['info', 'success', 'warning', 'error', 'secondary'],
        value: 'info',
      },
      variant: {
        label: 'Surface',
        options: ['soft', 'outlined', 'plain'],
        value: 'soft',
      },
      withAction: true,
      withDetails: true,
    },
    { store },
  ) as PlaygroundControls;

  const { closable, detailsExpanded, withAction, withDetails, ...alertProps } = control;

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={20} padding={16} style={{ width: '100%' }}>
        <Flexbox gap={6}>
          <Flexbox horizontal align="center" gap={8}>
            <SlidersHorizontal aria-hidden="true" size={16} />
            <strong>Interactive playground</strong>
          </Flexbox>
          <span style={{ fontSize: 13, opacity: 0.65 }}>
            Adjust the controls to test semantic tone, surface, actions, and diagnostic detail.
          </span>
        </Flexbox>

        <Alert
          {...alertProps}
          action={withAction ? <Button size="small">Review</Button> : undefined}
          closable={closable ? { 'aria-label': 'Dismiss playground alert' } : false}
          extraDefaultExpand={detailsExpanded}
          key={`${alertKey}-${detailsExpanded}`}
          text={{ detail: 'Show technical details' }}
          extra={
            withDetails ? (
              <Flexbox gap={6} style={{ fontSize: 12 }}>
                {diagnosticDetails.map(([label, value]) => (
                  <Flexbox horizontal justify="space-between" key={label}>
                    <span style={{ opacity: 0.6 }}>{label}</span>
                    <code>{value}</code>
                  </Flexbox>
                ))}
              </Flexbox>
            ) : undefined
          }
        />

        <Button
          aria-label="Restore playground alert"
          size="small"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => setAlertKey((value) => value + 1)}
        >
          Restore alert
        </Button>
      </Flexbox>
    </StoryBook>
  );
};
