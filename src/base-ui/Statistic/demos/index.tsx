import { Flexbox } from '@lobehub/ui';
import { Statistic } from '@lobehub/ui/base-ui';

export default () => {
  return (
    <Flexbox horizontal gap={40} padding={16} wrap="wrap">
      <Statistic title="Total tokens" value={1284390} />
      <Statistic precision={2} prefix="$" title="Credits used" value={42.5} />
      <Statistic styles={{ value: { color: '#379d4a' } }} title="Pass rate" value="94.1%" />
      <Statistic suffix="/ 7" title="Pass / Fail" value={112} />
      <Statistic loading title="Loading" value={0} />
    </Flexbox>
  );
};
