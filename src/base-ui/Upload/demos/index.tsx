import { Flexbox, Upload, UploadDragger } from '@lobehub/ui';
import { Button } from '@lobehub/ui/base-ui';

export default () => {
  return (
    <Flexbox gap={16} padding={16}>
      <Upload multiple onFiles={(files) => console.info(files.map((file) => file.name))}>
        <Button>Upload file</Button>
      </Upload>
      <UploadDragger
        accept="image/*"
        description="Support for a single upload"
        title="Click or drag file to this area to upload"
        onFiles={(files) => console.info(files.map((file) => file.name))}
      />
    </Flexbox>
  );
};
