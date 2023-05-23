import { ContextMenu } from '@lobehub/ui';

export default () => {
  return (
    <>
      <div>RightClick</div>
      <ContextMenu
        items={[
          { label: '1', key: '1' },
          { label: '2', key: '2' },
          { label: '3', key: '3' },
        ]}
      />
    </>
  );
};
