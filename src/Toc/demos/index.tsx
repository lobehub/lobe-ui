import { StroyBook, Toc, type TocProps, useControls, useCreateStore } from '@lobehub/ui';

const items: TocProps['items'] = [
  {
    title: 'Default',
    id: 'Default',
  },
  {
    title: 'APIs',
    id: 'APIs',
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
    <StroyBook levaStore={store}>
      <Toc items={items} {...controls} />
    </StroyBook>
  );
};
