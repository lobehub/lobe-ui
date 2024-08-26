import { EmojiPicker } from '@unitalkai/ui';
import { useState } from 'react';

export default () => {
  const [loading, setLoading] = useState(false);
  return (
    <EmojiPicker
      allowDelete
      allowUpload
      loading={loading}
      onDelete={() => console.log('delete')}
      onUpload={(file) => {
        setLoading(true);
        console.log(file);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }}
    />
  );
};
