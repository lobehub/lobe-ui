import { Tabs } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();

  const controls: any = useControls(
    {
      compact: false,
      size: {
        options: ['small', 'middle', 'large'],
        value: 'middle',
      },
      tabPosition: {
        options: ['top', 'bottom', 'left', 'right'],
        value: 'top',
      },
      variant: {
        options: ['rounded', 'square', 'point'],
        value: 'rounded',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Tabs
        items={[
          {
            key: 'home',
            label: 'Home',
          },
          {
            key: 'components',
            label: 'Components',
          },
          {
            key: 'color',
            label: 'Color',
          },
          {
            key: 'changelog',
            label: 'Changelog',
          },
        ]}
        {...controls}
      />
    </StoryBook>
  );
};
