import { StroyBook, TokenTag, TokenTagProps, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: TokenTagProps | any = useControls(
    {
      maxValue: {
        step: 1,
        value: 5000,
      },
      value: {
        step: 1,
        value: 1000,
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <TokenTag {...control} />
    </StroyBook>
  );
};
