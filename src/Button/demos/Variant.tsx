import { Button, Grid } from '@lobehub/ui';

export default () => {
  return (
    <Grid>
      <Button>Button</Button>
      <Button variant={'outlined'}>Button</Button>
      <Button shadow variant={'outlined'}>
        Button
      </Button>
      <Button variant={'dashed'}>Button</Button>
      <Button variant={'text'}>Button</Button>
      <Button variant={'link'}>Button</Button>
    </Grid>
  );
};
