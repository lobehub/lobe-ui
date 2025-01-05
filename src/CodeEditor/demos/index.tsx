import { CodeEditor } from '@lobehub/ui';
import { useState } from 'react';

import { content } from '../../Markdown/demos/data';

export default () => {
  const [code, setCode] = useState<string>(content);
  return <CodeEditor language="md" onValueChange={setCode} value={code} variant={'block'} />;
};
