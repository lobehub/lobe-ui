import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker, Text } from '@lobehub/ui/base-ui';
import { useState } from 'react';

// `needConfirm` adds the OK button (a base-ui Button); the value is only committed by OK.
// It defaults to `true` with `showTime`; `needConfirm={false}` commits when the popup closes.
export default () => {
  const [log, setLog] = useState('—');

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
      <DatePicker
        needConfirm
        placeholder="needConfirm"
        onChange={(_date, dateString) => setLog(`onChange: ${JSON.stringify(dateString)}`)}
        onOk={(date) => setLog(`onOk: ${date?.format('YYYY-MM-DD') ?? 'null'}`)}
      />
      <DateRangePicker
        needConfirm
        onChange={(_dates, dateStrings) => setLog(`onChange: ${JSON.stringify(dateStrings)}`)}
      />
      <DatePicker
        showTime
        needConfirm={false}
        placeholder="showTime, needConfirm={false}"
        onChange={(_date, dateString) => setLog(`onChange: ${JSON.stringify(dateString)}`)}
      />
      <DatePicker
        showTime
        placeholder="showTime, showNow={false}"
        showNow={false}
        onChange={(_date, dateString) => setLog(`onChange: ${JSON.stringify(dateString)}`)}
      />
      <Text type="secondary">{log}</Text>
    </Flexbox>
  );
};
