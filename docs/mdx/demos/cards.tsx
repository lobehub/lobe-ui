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
    </Cards>
    <Divider orientation={'left'}>Icon & Title</Divider>
    <Cards>
      <Card href="/mdx/callout" icon={Warehouse} title="Callout" />
      <Card href="/mdx/callout" icon={Warehouse} title="Tabs" />
      <Card href="/mdx/callouts" icon={Warehouse} title="Steps" />
    </Cards>
    <Divider orientation={'left'}>Icon & Desc & Title</Divider>
    <Cards>
      <Card desc="Demo desction text" href="/mdx/callout" icon={Warehouse} title="Callout" />
      <Card desc="Demo desction text" href="/mdx/callout" icon={Warehouse} title="Tabs" />
      <Card desc="Demo desction text" href="/mdx/callouts" icon={Warehouse} title="Steps" />
    </Cards>
    <Divider orientation={'left'}>Tags</Divider>
    <Cards>
      <Card
        desc="Demo desction text"
        href="/mdx/callout"
        tag={'Components'}
        tagColor={'cyan'}
        title="Callout"
      />
      <Card desc="Demo desction text" href="/mdx/callout" tag={'Components'} title="Tabs" />
      <Card desc="Demo desction text" href="/mdx/callouts" tag={'Components'} title="Steps" />
    </Cards>
    <Divider orientation={'left'}>Image Cover</Divider>
    <Cards>
      <Card
        href="/mdx/callout"
        icon={Warehouse}
        image="https://gw.alipayobjects.com/zos/kitchen/sLO%24gbrQtp/lobe-chat.webp"
        title="Callout"
      />
      <Card
        href="/mdx/callout"
        icon={Warehouse}
        image="https://gw.alipayobjects.com/zos/kitchen/sLO%24gbrQtp/lobe-chat.webp"
        title="Tabs"
      />
      <Card
        href="/mdx/callouts"
        icon={Warehouse}
        image="https://gw.alipayobjects.com/zos/kitchen/sLO%24gbrQtp/lobe-chat.webp"
        title="Steps"
      />
    </Cards>
  </Typography>
);
