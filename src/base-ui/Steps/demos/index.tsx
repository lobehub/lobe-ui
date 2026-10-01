import { Flexbox } from '@lobehub/ui';
import { Button, Steps } from '@lobehub/ui/base-ui';
import { ChartLineIcon, PencilRulerIcon, ShieldIcon } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [current, setCurrent] = useState(0);

  return (
    <Flexbox gap={32} padding={16}>
      <Flexbox gap={12}>
        <Steps
          current={current}
          items={[{ title: 'Select type' }, { title: 'Fill form' }, { title: 'Done' }]}
        />
        <Flexbox horizontal gap={8}>
          <Button disabled={current === 0} onClick={() => setCurrent(current - 1)}>
            Back
          </Button>
          <Button disabled={current === 2} type="primary" onClick={() => setCurrent(current + 1)}>
            Next
          </Button>
        </Flexbox>
      </Flexbox>
      <Steps
        orientation="vertical"
        items={[
          {
            description: 'Describe the assistant you want in one sentence.',
            icon: <PencilRulerIcon size={14} />,
            title: 'Create an assistant',
          },
          {
            description: 'Anonymous usage data shows which features matter most.',
            icon: <ChartLineIcon size={14} />,
            title: 'Improve the product',
          },
          {
            description: 'Turn data collection off at any time in settings.',
            icon: <ShieldIcon size={14} />,
            title: 'Stay in control',
          },
        ]}
      />
      <Steps
        orientation="vertical"
        variant="dot"
        items={[
          { title: 'Install Node.js 18 or later' },
          { title: 'Run npx @modelcontextprotocol/server' },
          { title: 'Enter the port in plugin settings' },
        ]}
      />
    </Flexbox>
  );
};
