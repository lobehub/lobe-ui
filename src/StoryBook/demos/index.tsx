import { StoryBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const { text, color, fontSize, fontWeight, upperCase } = useControls(
    {
      color: '#ff005b',
      fontSize: {
        max: 100,
        min: 4,
        step: 2,
        value: 14,
      },
      fontWeight: {
        options: ['normal', 'bold'],
        value: 'normal',
      },
      text: 'StoryBook',
      upperCase: false,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <div style={{ color, fontSize, fontWeight }}>{upperCase ? text.toUpperCase() : text}</div>
    </StoryBook>
  );
};
