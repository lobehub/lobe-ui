import {
  FluentEmoji,
  type FluentEmojiProps,
  StroyBook,
  useControls,
  useCreateStore,
} from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: FluentEmojiProps | any = useControls(
    {
      emoji: '🤯',
      size: {
        max: 128,
        min: 16,
        step: 1,
        value: 72,
      },
      type: {
        options: ['modern', 'flat', 'high-contrast'],
        value: 'modern',
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <FluentEmoji {...control} />
    </StroyBook>
  );
};
