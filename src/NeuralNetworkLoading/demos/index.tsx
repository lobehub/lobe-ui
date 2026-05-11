import { NeuralNetworkLoading } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const { size } = useControls(
    {
      size: { max: 256, min: 16, step: 4, value: 96 },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <NeuralNetworkLoading size={size} />
    </StoryBook>
  );
};
