import { Typography } from '@lobehub/ui';
import { Card, Cards } from '@lobehub/ui/mdx';
import { Divider } from 'antd';
import { Warehouse } from 'lucide-react';

export default () => (
  <Typography>
    <Cards>
      <Card href="/mdx/callout" title="Callout" />
      <Card href="/mdx/callout" title="Tabs" />
      <Card href="/mdx/callouts" title="Steps" />
      <Card href="/mdx/callouts" title="FileTree" />
    </Cards>
    <Divider titlePlacement={'left'}>Icon & Title</Divider>
    <Cards>
      <Card href="/mdx/callout" icon={Warehouse} title="Callout" />
      <Card href="/mdx/callout" icon={Warehouse} title="Tabs" />
      <Card href="/mdx/callouts" icon={Warehouse} title="Steps" />
      <Card href="/mdx/callouts" icon={Warehouse} title="FileTree" />
    </Cards>
    <Divider titlePlacement={'left'}>Icon & Desc & Title</Divider>
    <Cards>
      <Card desc="Demo desction text" href="/mdx/callout" icon={Warehouse} title="Callout" />
      <Card desc="Demo desction text" href="/mdx/callout" icon={Warehouse} title="Tabs" />
      <Card desc="Demo desction text" href="/mdx/callouts" icon={Warehouse} title="Steps" />
      <Card desc="Demo desction text" href="/mdx/callouts" icon={Warehouse} title="FileTree" />
    </Cards>
    <Divider titlePlacement={'left'}>Tags</Divider>
    <Cards>
      <Card
        desc="Demo desction text"
        href="/mdx/callout"
        tag={'Components'}
        tagColor={'gold'}
        title="Callout"
      />
      <Card desc="Demo desction text" href="/mdx/callout" tag={'Components'} title="Tabs" />
      <Card desc="Demo desction text" href="/mdx/callouts" tag={'Components'} title="Steps" />
      <Card desc="Demo desction text" href="/mdx/callouts" tag={'Components'} title="FileTree" />
    </Cards>
    <Divider titlePlacement={'left'}>Image Cover</Divider>
    <Cards>
      <Card
        href="/mdx/callout"
        icon={Warehouse}
        image="https://github.com/user-attachments/assets/2428a136-38bf-488c-8033-d9f261d67f3d"
        title="Callout"
      />
      <Card
        href="/mdx/callout"
        icon={Warehouse}
        image="https://github.com/user-attachments/assets/2428a136-38bf-488c-8033-d9f261d67f3d"
        title="Tabs"
      />
      <Card
        href="/mdx/callouts"
        icon={Warehouse}
        image="https://github.com/user-attachments/assets/2428a136-38bf-488c-8033-d9f261d67f3d"
        title="Steps"
      />
      <Card
        href="/mdx/callouts"
        icon={Warehouse}
        image="https://github.com/user-attachments/assets/2428a136-38bf-488c-8033-d9f261d67f3d"
        title="FileTree"
      />
    </Cards>
  </Typography>
);
