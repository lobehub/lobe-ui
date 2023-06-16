import { StroyBook, TokenTag, TokenTagProps, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();
  const control: TokenTagProps | any = useControls(
    {
      value: {
        value: 1000,
        step: 1,
      },
      maxValue: {
        value: 5000,
        step: 1,
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
