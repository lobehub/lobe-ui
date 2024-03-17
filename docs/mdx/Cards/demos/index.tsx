import { Typography } from '@lobehub/ui';
import { Cards } from '@lobehub/ui/mdx';
import { Warehouse } from 'lucide-react';

export default () => (
  <Typography>
    <Cards>
      <Cards.Card href="/mdx/callout" icon={Warehouse} title="Callout" />
      <Cards.Card href="/mdx/callout" icon={Warehouse} title="Tabs" />
      <Cards.Card href="/mdx/callouts" icon={Warehouse} title="Steps" />
    </Cards>
    <Cards>
      <Cards.Card desc="Demo desction text" href="/mdx/callout" icon={Warehouse} title="Callout" />
      <Cards.Card desc="Demo desction text" href="/mdx/callout" icon={Warehouse} title="Tabs" />
      <Cards.Card desc="Demo desction text" href="/mdx/callouts" icon={Warehouse} title="Steps" />
    </Cards>
    <Cards>
      <Cards.Card
        href="/mdx/callout"
        icon={Warehouse}
        image="https://gw.alipayobjects.com/zos/kitchen/sLO%24gbrQtp/lobe-chat.webp"
        title="Callout"
      />
      <Cards.Card
        href="/mdx/callout"
        icon={Warehouse}
        image="https://gw.alipayobjects.com/zos/kitchen/sLO%24gbrQtp/lobe-chat.webp"
        title="Tabs"
      />
      <Cards.Card
        href="/mdx/callouts"
        icon={Warehouse}
        image="https://gw.alipayobjects.com/zos/kitchen/sLO%24gbrQtp/lobe-chat.webp"
        title="Steps"
      />
    </Cards>
  </Typography>
);
