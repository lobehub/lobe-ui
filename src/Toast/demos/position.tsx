import { Button, type ToastOptions, toast } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      placement: {
        options: ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right'],
        value: 'bottom-right',
      },
    },
    { store },
  ) as Pick<ToastOptions, 'placement'>;

  return (
    <StoryBook levaStore={store}>
      <Button
        onClick={() =>
          toast.success({
            description: `Toast at ${options.placement}`,
            placement: options.placement,
          })
        }
      >
        Show Toast
      </Button>
    </StoryBook>
  );
};
