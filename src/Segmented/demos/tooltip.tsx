import { Icon, Segmented, Tooltip } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Grid2X2, List, StretchHorizontal } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      glass: false,
      shadow: false,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Segmented
        {...control}
        defaultValue="list"
        options={[
          {
            label: (
              <Tooltip title="List View">
                <Icon icon={List} />
              </Tooltip>
            ),
            value: 'list',
          },
          {
            label: (
              <Tooltip title="Grid View">
                <Icon icon={Grid2X2} />
              </Tooltip>
            ),
            value: 'grid',
          },
          {
            label: (
              <Tooltip title="Compact View">
                <Icon icon={StretchHorizontal} />
              </Tooltip>
            ),
            value: 'compact',
          },
        ]}
        onChange={(value) => {
          console.log(value);
        }}
      />
    </StoryBook>
  );
};
