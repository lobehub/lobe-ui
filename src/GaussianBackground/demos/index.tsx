import { GaussianBackground, StoryBook, useControls, useCreateStore } from '@unitalkai/ui';
import { useTheme } from 'antd-style';

export default () => {
  const theme = useTheme();
  const store = useCreateStore();
  const Options = useControls(
    'Options',
    {
      blurRadius: 16,
      fpsCap: 60,
      scale: 16,
    },
    { store },
  );
  const Layer1 = useControls(
    'Layer1',
    {
      color: theme.gold,
    },
    { store },
  );
  const Layer2 = useControls(
    'Layer2',
    {
      color: theme.cyan,
      maxVelocity: 0.2,
      orbs: 4,
      radius: 8,
    },
    { store },
  );
  const Layer3 = useControls(
    'Layer3',
    {
      color: theme.purple,
      maxVelocity: 0.2,
      orbs: 4,
      radius: 16,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store} noPadding>
      <GaussianBackground layers={[Layer3, Layer2, Layer1]} options={Options} />
    </StoryBook>
  );
};
