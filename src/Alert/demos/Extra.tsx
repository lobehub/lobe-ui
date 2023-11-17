import { Alert, Highlighter } from '@lobehub/ui';

const demoError = {
  details: {
    exception: 'Validation filter failed',
    msgId: 'Id-f5aab7304f6c754804f70000',
  },
  reasons: [
    {
      language: 'en',
      message: 'Validation filter failed',
    },
  ],
};
export default () => {
  return (
    <Alert
      extra={
        <Highlighter copyButtonSize={'small'} language={'json'} type={'pure'}>
          {JSON.stringify(demoError, null, 2)}
        </Highlighter>
      }
      message={'Quest error'}
      showIcon
      type={'error'}
    />
  );
};
