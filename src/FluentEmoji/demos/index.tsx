import { getEmoji, getEmojiNameByCharacter } from '@lobehub/fluent-emoji';
import { FluentEmoji, type FluentEmojiProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Button } from 'antd';

import { Flexbox } from '@/Flex';

export default () => {
  const store = useCreateStore();
  const control = useControls(
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
  ) as FluentEmojiProps;

  return (
    <StoryBook levaStore={store}>
      <Flexbox align={'center'} gap={8}>
        <Flexbox gap={8} horizontal>
          <FluentEmoji type={'anim'} {...control} />
          <FluentEmoji type={'3d'} {...control} />
          <FluentEmoji type={'modern'} {...control} />
          <FluentEmoji type={'flat'} {...control} />
          <FluentEmoji type={'mono'} {...control} />
          <FluentEmoji type={'raw'} {...control} />
        </Flexbox>
        <Button icon={getEmoji(control.emoji)}>{getEmojiNameByCharacter(control.emoji)}</Button>
      </Flexbox>
    </StoryBook>
  );
};
