import { Button, Flexbox, toast } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Bell, Rocket, Sparkles, Trash2 } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      hideCloseButton: false,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
        <Button
          icon={Rocket}
          type="primary"
          onClick={() =>
            toast({
              actions: [
                {
                  label: 'Noop',
                  onClick: () => console.log('noop'),
                  variant: 'text',
                },
                {
                  label: 'Danger',
                  onClick: () => toast.error('Deleted!'),
                  variant: 'danger',
                },
                {
                  label: 'Cancel',
                  onClick: () => toast.dismiss(),
                  variant: 'ghost',
                },
                {
                  label: 'Confirm',
                  onClick: () => toast.success('Confirmed!'),
                },
              ],
              description: 'Do you want to proceed with this action?',
              hideCloseButton: options.hideCloseButton,
              title: 'Multiple Actions',
            })
          }
        >
          Multiple Actions
        </Button>
        <Button
          icon={Sparkles}
          onClick={() =>
            toast({
              description: 'Using a custom icon for this toast.',
              hideCloseButton: options.hideCloseButton,
              icon: Sparkles,
              title: 'Custom Icon',
              type: 'info',
            })
          }
        >
          Custom Icon
        </Button>
        <Button
          icon={Bell}
          onClick={() =>
            toast({
              description: 'This toast has no close button but can still be dismissed by swipe.',
              hideCloseButton: true,
              title: 'Hidden Close Button',
              type: 'warning',
            })
          }
        >
          Hide Close Button
        </Button>
        <Button
          danger
          icon={Trash2}
          onClick={() =>
            toast({
              actions: [
                {
                  label: 'Keep',
                  onClick: () => toast.dismiss(),
                  variant: 'secondary',
                },
                {
                  label: 'Delete',
                  onClick: () => toast.error('Deleted!'),
                  variant: 'danger',
                },
              ],
              description: 'This action cannot be undone.',
              hideCloseButton: true,
              icon: Trash2,
              title: 'Delete Confirmation',
              type: 'error',
            })
          }
        >
          Delete Confirm
        </Button>
      </Flexbox>
    </StoryBook>
  );
};
