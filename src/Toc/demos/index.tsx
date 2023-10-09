import { StoryBook, Toc, type TocProps, useControls, useCreateStore } from '@lobehub/ui';

const items: TocProps['items'] = [
  {
    id: 'Default',
    title: 'Default',
  },
  {
    id: 'APIs',
    title: 'APIs',
  },
];
export default () => {
  const store = useCreateStore();
  const controls: TocProps | any = useControls(
    {
      isMobile: false,
    },
    { store },
  );
  return (
    <StoryBook levaStore={store}>
      <Toc items={items} {...controls} />
    </StoryBook>
  );
};
