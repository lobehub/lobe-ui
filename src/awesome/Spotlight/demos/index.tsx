import { cssVar } from '@lobehub/ui';
import { Spotlight, type SpotlightProps } from '@lobehub/ui/awesome';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      size: 64,
    },
    { store },
  ) as SpotlightProps;

  return (
    <StoryBook levaStore={store}>
      <div
        style={{
          background: cssVar.colorBgLayout,
          border: `1px solid ${cssVar.colorBorder}`,
          borderRadius: cssVar.borderRadius,
          height: 36,
          position: 'relative',
          width: '100%',
        }}
      >
        <Spotlight {...control} />
      </div>
    </StoryBook>
  );
};
