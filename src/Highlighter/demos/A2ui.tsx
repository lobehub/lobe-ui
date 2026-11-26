import { Highlighter } from '@lobehub/ui';

// Sample data from the A2UI playground CodeBlock (CopilotKit a2ui-playground, MIT).
const code = `export const playgroundUI = createGenerativeUI({
  id: CATALOG_ID,
  extends: [standardUI],
  components,
});`;

export default () => (
  <Highlighter fileName="catalog.ts" language="ts" variant="a2ui">
    {code}
  </Highlighter>
);
