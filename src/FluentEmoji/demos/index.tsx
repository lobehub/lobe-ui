import {
  FluentEmoji,
  type FluentEmojiProps,
  StoryBook,
  getEmoji,
  getEmojiNameByCharacter,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { Button } from 'antd';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const store = useCreateStore();
  const control: FluentEmojiProps | any = useControls(
    {
      emoji: '🤯',
      size: {
        max: 128,
        min: 16,
        step: 1,
        value: 64,
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Flexbox align={'center'} gap={8}>
        <Flexbox gap={8} horizontal>
          <FluentEmoji type={'anim'} {...control} />
          <FluentEmoji type={'3d'} {...control} />
          <FluentEmoji type={'modern'} {...control} />
          <FluentEmoji type={'flat'} {...control} />
          <FluentEmoji type={'high-contrast'} {...control} />
          <FluentEmoji type={'pure'} {...control} />
        </Flexbox>
        <Button icon={getEmoji(control.emoji)}>{getEmojiNameByCharacter(control.emoji)}</Button>
      </Flexbox>
    </StoryBook>
  );
};
