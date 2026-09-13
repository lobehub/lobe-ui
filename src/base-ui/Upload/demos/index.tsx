import { Flexbox, Upload, UploadDragger } from '@lobehub/ui';

export default () => {
  return (
    <Flexbox gap={16} padding={16}>
      <Upload multiple onFiles={(files) => console.info(files.map((file) => file.name))}>
        <button type="button">Upload file</button>
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
