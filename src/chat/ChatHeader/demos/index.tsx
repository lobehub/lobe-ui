import { ChatHeader, ChatHeaderProps } from '@lobehub/ui/chat';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control: ChatHeaderProps | any = useControls(
    {
      showBackButton: false,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store} noPadding>
      <ChatHeader {...control} left={<div>Left</div>} right={<div>Right</div>} />
    </StoryBook>
  );
};
