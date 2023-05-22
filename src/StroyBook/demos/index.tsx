import { StroyBook, useControls, useCreateStore } from '@lobehub/ui';
export default () => {
  const store = useCreateStore();
  const { text, color, fontSize, fontWeight, upperCase } = useControls(
    {
      text: 'StoryBook',
      color: '#ff005b',
      fontWeight: {
        value: 'normal',
        options: ['normal', 'bold'],
      },
      fontSize: {
        value: 14,
        step: 2,
        max: 100,
        min: 4,
      },
      upperCase: false,
    },
    { store },
  );
  return (
    <StroyBook levaStore={store}>
      <div style={{ color, fontSize, fontWeight }}>{upperCase ? text.toUpperCase() : text}</div>
    </StroyBook>
  );
};
