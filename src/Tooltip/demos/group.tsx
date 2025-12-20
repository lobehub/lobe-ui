import { Button, Tooltip, TooltipGroup } from '@lobehub/ui';
import { StoryBook, useCreateStore } from '@lobehub/ui/storybook';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const store = useCreateStore();
  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={12} horizontal>
        <TooltipGroup>
          <Tooltip closeDelay={10_000_000_000} title="First tooltip">
            <Button type="primary">First</Button>
          </Tooltip>
          <Tooltip closeDelay={1000} title="Second tooltip">
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
