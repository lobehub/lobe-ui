import { InputNumber, Select, Switch } from '@lobehub/ui';
import { Form, useForm } from '@lobehub/ui/form';
import { useState } from 'react';

type Settings = { maxTokens: number; model: string; stream: boolean };

const models = ['gpt-5.6-luna', 'claude-opus-5-5', 'gemini-3-pro'].map((value) => ({
  label: value,
  value,
}));

export default () => {
  const [saved, setSaved] = useState<Settings>({
    maxTokens: 4096,
    model: 'gpt-5.6-luna',
    stream: true,
  });

  const form = useForm<Settings>({
    initialValues: saved,
    onValuesChange: (_changed, values) => setSaved(values),
    values: saved,
    valuesChangeDebounce: 400,
  });

  return (
    <>
      <Form
        form={form}
        items={[
          {
            children: [
              {
                children: <Select options={models} style={{ width: 200 }} />,
                label: 'Model',
                name: 'model',
              },
              { children: <InputNumber min={1} />, label: 'Max output tokens', name: 'maxTokens' },
              {
                children: <Switch />,
                desc: 'Render the reply as it arrives',
                label: 'Streaming',
                name: 'stream',
              },
            ],
            key: 'model',
            title: 'Model',
          },
        ]}
      />
      <pre style={{ fontSize: 12 }}>{JSON.stringify(saved, null, 2)}</pre>
    </>
  );
};
