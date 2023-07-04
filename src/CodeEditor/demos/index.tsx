import { CodeEditor } from '@lobehub/ui';
import { content } from '@lobehub/ui/Markdown/demos/data';
import { useState } from 'react';

export default () => {
  const [code, setCode] = useState<string>(content);
  return <CodeEditor language="md" onValueChange={setCode} resize={false} value={code} />;
};
