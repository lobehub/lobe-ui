import { ChatHeader, ChatHeaderProps, StoryBook, useControls, useCreateStore } from '@unitalkai/ui';

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
