import { Button, Flexbox, ToastHost, type ToastOptions, toast } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Bell, CheckCircle, Info, Loader2, type LucideIcon, XCircle } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      closable: true,
      duration: {
        max: 10_000,
        min: 1000,
        step: 500,
        value: 5000,
      },
      placement: {
        options: ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right'],
        value: 'bottom-right',
      },
      showIcon: true,
    },
    { store },
  ) as Pick<ToastOptions, 'closable' | 'duration' | 'placement'> & { showIcon: boolean };

  const showToast = (
    type: 'success' | 'error' | 'info' | 'warning' | 'loading',
    title: string,
    description?: string,
    icon?: LucideIcon,
  ) => {
    const toastOptions: ToastOptions = {
      closable: options.closable,
      description,
      duration: options.duration,
      icon: options.showIcon && icon ? icon : undefined,
      placement: options.placement,
      title,
      type,
    };

    switch (type) {
      case 'success': {
        toast.success(toastOptions);
        break;
      }
      case 'error': {
        toast.error(toastOptions);
        break;
      }
      case 'info': {
        toast.info(toastOptions);
        break;
      }
      case 'warning': {
        toast.warning(toastOptions);
        break;
      }
      case 'loading': {
        toast.loading(toastOptions);
        break;
      }
    }
  };

  return (
    <StoryBook levaStore={store}>
      <ToastHost />
      <Flexbox gap={8} horizontal style={{ flexWrap: 'wrap' }}>
        <Button
          icon={CheckCircle}
          onClick={() =>
            showToast(
              'success',
              'Operation successful!',
              'Your changes have been saved.',
              CheckCircle,
            )
          }
          type="primary"
        >
          Success
        </Button>
        <Button
          danger
          icon={XCircle}
          onClick={() =>
            showToast('error', 'Something went wrong!', 'Please try again later.', XCircle)
          }
        >
          Error
        </Button>
        <Button
          icon={Info}
          onClick={() =>
            showToast('info', 'Information', 'Here is some helpful information for you.', Info)
          }
        >
          Info
        </Button>
        <Button
          icon={Bell}
          onClick={() =>
            showToast('warning', 'Warning', 'Please review your settings before continuing.', Bell)
          }
          type="default"
        >
          Warning
        </Button>
        <Button
          icon={Loader2}
          onClick={() =>
            showToast(
              'loading',
              'Processing',
              'Please wait while we process your request...',
              Loader2,
            )
          }
        >
          Loading
        </Button>
        <Button
          onClick={() =>
            toast({
              closable: options.closable,
              description:
                'This is a custom toast with title and description. You can customize it with various options.',
              duration: options.duration,
              placement: options.placement,
              title: 'Custom Toast',
            })
          }
        >
          Custom
        </Button>
        <Button onClick={() => toast.dismiss()} type="text">
          Dismiss All
        </Button>
      </Flexbox>
    </StoryBook>
  );
};
