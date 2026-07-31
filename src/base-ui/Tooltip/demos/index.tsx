import { Tooltip, type TooltipProps } from '@lobehub/ui';
import { Button } from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      arrow: false,
      hotkey: 'mod+k',
      title: 'Example tooltip',
    },
    { store },
  ) as TooltipProps;

  return (
    <StoryBook levaStore={store}>
      <Tooltip {...control}>
        <Button type="primary">Tooltip</Button>
      </Tooltip>
    </StoryBook>
  );
};
