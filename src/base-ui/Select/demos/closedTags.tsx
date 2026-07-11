import { Flexbox, Text } from '@lobehub/ui';
import { Select } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <Flexbox gap={12}>
      <Text>The popup is forced closed. Type a tag and press Enter, comma, or space.</Text>
      <Select
        mode="tags"
        open={false}
        placeholder="Type a tag and press Enter"
        style={{ width: '100%' }}
        tokenSeparators={[',', '，', ' ']}
        value={tags}
        onChange={(nextValue) => setTags(Array.isArray(nextValue) ? nextValue : [])}
      />
      <Text code>Tags: {JSON.stringify(tags)}</Text>
    </Flexbox>
  );
};
