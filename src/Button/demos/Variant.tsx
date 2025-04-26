import { Button, Grid } from '@lobehub/ui';

export default () => {
  return (
    <Grid>
      <Button type={'primary'}>Button</Button>
      <Button>Button</Button>
      <Button variant={'outlined'}>Button</Button>
      <Button variant={'filled'}>Button</Button>
      <Button type={'text'}>Button</Button>
      <Button type={'link'}>Button</Button>
    </Grid>
  );
};
