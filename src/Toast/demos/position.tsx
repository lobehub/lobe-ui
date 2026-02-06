import { Button, Flexbox, toast, type ToastOptions } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { MapPin } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      duration: {
        max: 10_000,
        min: 1000,
        step: 500,
        value: 3000,
      },
      placement: {
        options: ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right'],
        value: 'bottom-right',
      },
      toastType: {
        options: ['success', 'error', 'info', 'warning'],
        value: 'success',
      },
      withDescription: true,
    },
    { store },
  ) as Pick<ToastOptions, 'placement'> & {
    duration: number;
    toastType: 'success' | 'error' | 'info' | 'warning';
    withDescription: boolean;
  };

  const showToastAtPosition = () => {
    const toastConfig: ToastOptions = {
      description: options.withDescription
        ? `This toast appears at ${options.placement} position`
        : undefined,
      duration: options.duration,
      placement: options.placement,
      title: `Toast at ${options.placement}`,
    };

    switch (options.toastType) {
      case 'success': {
        toast.success(toastConfig);
        break;
      }
      case 'error': {
        toast.error(toastConfig);
        break;
      }
      case 'info': {
        toast.info(toastConfig);
        break;
      }
      case 'warning': {
        toast.warning(toastConfig);
        break;
      }
    }
  };

  const showAllPositions = () => {
    const positions: ToastOptions['placement'][] = [
      'top',
      'top-left',
      'top-right',
      'bottom',
      'bottom-left',
      'bottom-right',
    ];

    positions.forEach((position, index) => {
      setTimeout(() => {
        toast.info({
          description: `Position: ${position}`,
          duration: 4000,
          placement: position,
          title: `Toast #${index + 1}`,
        });
      }, index * 200);
    });
  };

  return (
    <StoryBook levaStore={store}>
      <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
        <Button icon={MapPin} type="primary" onClick={showToastAtPosition}>
          Show Toast at Position
        </Button>
        <Button onClick={showAllPositions}>Show All Positions</Button>
      </Flexbox>
    </StoryBook>
  );
};
