import { Button, Empty, type EmptyProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Inbox, Package } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      description: 'There is no data to display',
      emoji: '📭',
      icon: {
        options: [Inbox, Package],
        value: Inbox,
      },
      iconType: {
        options: ['none', 'icon', 'emoji'],
        value: 'icon',
      },
      imageSize: {
        max: 128,
        min: 24,
        step: 4,
        value: 48,
      },
      showAction: false,
      title: 'Oh no! Nothing here',
      type: {
        options: ['default', 'page'],
        value: 'default',
      },
    },
    { store },
  );

  const emptyProps: EmptyProps = {
    description: control.description,
    imageSize: control.imageSize,
    title: control.title,
    type: control.type,
  } as EmptyProps;

  if (control.iconType === 'icon') {
    emptyProps.icon = control.icon;
  } else if (control.iconType === 'emoji') {
    emptyProps.emoji = control.emoji;
  }

  if (control.showAction) {
    emptyProps.action = <Button type="primary">Create Item</Button>;
  }

  return (
    <StoryBook levaStore={store}>
      <Empty {...emptyProps} />
    </StoryBook>
  );
};
