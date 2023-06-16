import { StroyBook, Tooltip, TooltipProps, useControls, useCreateStore } from '@lobehub/ui';
import { Button } from 'antd';

export default () => {
  const store = useCreateStore();
  const control: TooltipProps | any = useControls(
    {
      arrow: false,
      title: 'Example tooltip',
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <Tooltip {...control}>
        <Button type="primary">Tooltip</Button>
      </Tooltip>
    </StroyBook>
  );
};
