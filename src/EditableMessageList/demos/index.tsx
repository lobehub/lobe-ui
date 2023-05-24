import { EditableMessageList } from '@lobehub/ui';

import { data } from './data';

export default () => <EditableMessageList dataSources={data} onChange={console.log} />;
