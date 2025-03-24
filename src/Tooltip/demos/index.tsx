import { Tooltip, TooltipProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Button } from 'antd';

export default () => {
  const store = useCreateStore();
  const control: TooltipProps | any = useControls(
    {
      arrow: false,
      hotkey: 'mod+k',
      title: 'Example tooltip',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Tooltip {...control}>
        <Button type="primary">Tooltip</Button>
      </Tooltip>
    </StoryBook>
  );
};
