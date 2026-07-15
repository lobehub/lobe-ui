import { EmojiPicker } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [loading, setLoading] = useState(false);
  return (
    <EmojiPicker
      allowDelete
      allowUpload
      loading={loading}
      onDelete={() => console.info('delete')}
      onUpload={(file) => {
        setLoading(true);
        console.info(file);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }}
    />
  );
};
