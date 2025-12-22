import { Button, Tooltip, TooltipGroup } from '@lobehub/ui';
import { StoryBook, useCreateStore } from '@lobehub/ui/storybook';

import { Flexbox } from '@/Flex';

export default () => {
  const store = useCreateStore();
  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={12} horizontal>
        <TooltipGroup arrow closeDelay={300} openDelay={300} placement="bottom">
          <Tooltip title="Shared arrow + placement">
            <Button type="primary">Shared</Button>
          </Tooltip>
          <Tooltip arrow={false} placement="right" title="Overrides shared props">
            <Button>Override</Button>
          </Tooltip>
          <Tooltip title="Shared delay">
            <Button>Delay</Button>
          </Tooltip>
        </TooltipGroup>
      </Flexbox>
    </StoryBook>
  );
};
