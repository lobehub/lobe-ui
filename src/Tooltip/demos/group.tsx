import { Button, Tooltip, TooltipGroup } from '@lobehub/ui';
import { StoryBook, useCreateStore } from '@lobehub/ui/storybook';

import { Flexbox } from '@/Flex';

export default () => {
  const store = useCreateStore();
  return (
    <StoryBook levaStore={store}>
      <Flexbox horizontal gap={12}>
        <TooltipGroup layoutAnimation>
          <Tooltip
            closeDelay={10_000_000_000}
            title="The Tooltip component is used to provide additional information to the user when they hover over a specific element."
          >
            <Button type="primary">First</Button>
          </Tooltip>
          <Tooltip
            title={
              'Wrap multiple tooltips in TooltipGroup to share a single floating instance. When you hover/focus different triggers, the tooltip only updates the anchor + content, reducing per-tooltip overhead.Wrap multiple tooltips in TooltipGroup to share a single floating instance. When you hover/focus different triggers, the tooltip only updates the anchor + content, reducing per-tooltip overhead.'
            }
          >
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
