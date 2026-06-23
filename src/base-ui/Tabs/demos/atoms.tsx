import { Flexbox } from '@lobehub/ui';
import { TabsIndicator, TabsList, TabsPanel, TabsRoot, TabsTab } from '@lobehub/ui/base-ui';

export default () => {
  return (
    <Flexbox gap={24}>
      <TabsRoot defaultValue="overview" variant="rounded">
        <TabsList>
          <TabsIndicator />
          <TabsTab value="overview">Overview</TabsTab>
          <TabsTab value="usage">Usage</TabsTab>
          <TabsTab value="api">API</TabsTab>
        </TabsList>
        <TabsPanel value="overview">Overview content</TabsPanel>
        <TabsPanel value="usage">Usage content</TabsPanel>
        <TabsPanel value="api">API content</TabsPanel>
      </TabsRoot>

      <TabsRoot defaultValue="overview" variant="square">
        <TabsList>
          <TabsIndicator />
          <TabsTab value="overview">Overview</TabsTab>
          <TabsTab value="usage">Usage</TabsTab>
          <TabsTab value="api">API</TabsTab>
        </TabsList>
        <TabsPanel value="overview">Overview content</TabsPanel>
        <TabsPanel value="usage">Usage content</TabsPanel>
        <TabsPanel value="api">API content</TabsPanel>
      </TabsRoot>

      <TabsRoot defaultValue="overview" variant="point">
        <TabsList>
          <TabsIndicator />
          <TabsTab value="overview">Overview</TabsTab>
          <TabsTab value="usage">Usage</TabsTab>
          <TabsTab value="api">API</TabsTab>
        </TabsList>
        <TabsPanel value="overview">Overview content</TabsPanel>
        <TabsPanel value="usage">Usage content</TabsPanel>
        <TabsPanel value="api">API content</TabsPanel>
      </TabsRoot>
    </Flexbox>
  );
};
