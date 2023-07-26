import { ChatHeader, ChatHeaderProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: ChatHeaderProps | any = useControls(
    {
      showBackButton: false,
    },
    { store },
  );

  return (
    <StroyBook levaStore={store} noPadding>
      <ChatHeader {...control} left={<div>Left</div>} right={<div>Right</div>} />
      <div style={{ height: 100 }} />
    </StroyBook>
  );
};
