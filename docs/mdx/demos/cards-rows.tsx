import { Typography } from '@lobehub/ui';
import { Card, Cards } from '@lobehub/ui/mdx';
import { Divider } from 'antd';

export default () => (
  <Typography>
    <Cards maxItemWidth={100} rows={4}>
      <Card href="/mdx/callout" title="Callout" />
      <Card href="/mdx/callout" title="Tabs" />
      <Card href="/mdx/callouts" title="Steps" />
      <Card href="/mdx/callouts" title="FileTree" />
    </Cards>
    <Divider />
    <Cards maxItemWidth={200} rows={3}>
      <Card href="/mdx/callout" title="Callout" />
      <Card href="/mdx/callout" title="Tabs" />
      <Card href="/mdx/callouts" title="Steps" />
      <Card href="/mdx/callouts" title="FileTree" />
    </Cards>
    <Divider />
    <Cards rows={2}>
      <Card href="/mdx/callout" title="Callout" />
      <Card href="/mdx/callout" title="Tabs" />
      <Card href="/mdx/callouts" title="Steps" />
      <Card href="/mdx/callouts" title="FileTree" />
    </Cards>
    <Divider />
    <Cards rows={1}>
      <Card href="/mdx/callout" title="Callout" />
      <Card href="/mdx/callout" title="Tabs" />
      <Card href="/mdx/callouts" title="Steps" />
      <Card href="/mdx/callouts" title="FileTree" />
    </Cards>
  </Typography>
);
