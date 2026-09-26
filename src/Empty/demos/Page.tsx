import { Button, Empty } from '@lobehub/ui';
import { FolderOpen } from 'lucide-react';

export default () => (
  <Empty
    description="Upload documents, images or code and they'll be indexed for the agent automatically."
    icon={FolderOpen}
    title="No files in this project"
    type="page"
    action={
      <>
        <Button type="primary">Upload files</Button>
        <Button>Connect a folder</Button>
      </>
    }
  />
);
