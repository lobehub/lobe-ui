import { Button, ElapsedTime, Flexbox, Text } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [run, setRun] = useState(0);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [endTime, setEndTime] = useState<number>();

  return (
    <Flexbox gap={16} padding={24}>
      <Flexbox horizontal gap={24}>
        <Flexbox gap={4}>
          <Text fontSize={12} type="secondary">
            short
          </Text>
          <ElapsedTime endTime={endTime} key={`short-${run}`} startTime={startTime} />
        </Flexbox>
        <Flexbox gap={4}>
          <Text fontSize={12} type="secondary">
            clock
          </Text>
          <ElapsedTime
            endTime={endTime}
            format="clock"
            key={`clock-${run}`}
            startTime={startTime}
          />
        </Flexbox>
        <Flexbox gap={4}>
          <Text fontSize={12} type="secondary">
            started 61 minutes ago
          </Text>
          <ElapsedTime startTime={startTime - 61 * 60 * 1000} />
        </Flexbox>
      </Flexbox>
      <Flexbox horizontal gap={8}>
        <Button
          disabled={endTime !== undefined}
          size="small"
          onClick={() => setEndTime(Date.now())}
        >
          Finish
        </Button>
        <Button
          size="small"
          onClick={() => {
            setStartTime(Date.now());
            setEndTime(undefined);
            setRun((value) => value + 1);
          }}
        >
          Restart
        </Button>
      </Flexbox>
    </Flexbox>
  );
};
