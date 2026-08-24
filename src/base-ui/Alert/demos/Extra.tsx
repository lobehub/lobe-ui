import { Flexbox, Highlighter } from '@lobehub/ui';
import { Alert } from '@lobehub/ui/base-ui';

const details = {
  code: 'ECONNREFUSED',
  endpoint: 'https://api.example.com/v1/models',
  requestId: 'req_7f9a2d',
};

export default () => (
  <Flexbox gap={16} padding={16}>
    <Alert
      extraDefaultExpand
      description="Check the service status before retrying."
      text={{ detail: 'Show technical details' }}
      title="The model registry could not be reached."
      type="error"
      extra={
        <Highlighter actionIconSize="small" language="json" padding={0} variant="borderless">
          {JSON.stringify(details, null, 2)}
        </Highlighter>
      }
    />
    <Alert
      extraIsolate
      extra={<span>Check the service status before retrying the request.</span>}
      title="Maintenance is in progress."
      type="warning"
      variant="outlined"
    />
  </Flexbox>
);
