import { Grid, GridProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control: GridProps | any = useControls(
    {
      gap: {
        step: 1,
        value: 16,
      },
      maxItemWidth: {
        step: 1,
        value: 100,
      },
      rows: {
        step: 1,
        value: 3,
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Grid width={'100%'} {...control}>
        <div style={{ background: 'gray', height: 100 }} />
        <div style={{ background: 'gray', height: 100 }} />
        <div style={{ background: 'gray', height: 100 }} />
        <div style={{ background: 'gray', height: 100 }} />
        <div style={{ background: 'gray', height: 100 }} />
        <div style={{ background: 'gray', height: 100 }} />
      </Grid>
    </StoryBook>
  );
};
