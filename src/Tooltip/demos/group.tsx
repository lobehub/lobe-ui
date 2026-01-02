import { Button, Tooltip, TooltipGroup } from '@lobehub/ui';
import { StoryBook, useCreateStore } from '@lobehub/ui/storybook';

import { Flexbox } from '@/Flex';

export default () => {
  const store = useCreateStore();
  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={12} horizontal>
        <TooltipGroup>
          <Tooltip closeDelay={10_000_000_000} title="First tooltip">
            <Button type="primary">First</Button>
          </Tooltip>
          <Tooltip closeDelay={1000} title="First tooltix">
            <Button>Second</Button>
          </Tooltip>
          <Tooltip arrow placement="bottom" title="With arrow">
            <Button>Arrow</Button>
          </Tooltip>
        </TooltipGroup>
      </Flexbox>
    </StoryBook>
  );
};
