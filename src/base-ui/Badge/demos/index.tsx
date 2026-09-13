import { Badge, Flexbox } from '@lobehub/ui';

export default () => {
  return (
    <Flexbox gap={24} padding={16}>
      <Flexbox gap={8}>
        <Badge status="success" text="Success" />
        <Badge status="processing" text="Processing" />
        <Badge status="default" text="Default" />
        <Badge status="error" text="Error" />
        <Badge status="warning" text="Warning" />
        <Badge color="#7c4dff" text="Custom color" />
      </Flexbox>
      <Flexbox horizontal align="center" gap={24}>
        <Badge count={5}>
          <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 6, height: 40, width: 40 }} />
        </Badge>
        <Badge count={128} overflowCount={99}>
          <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 6, height: 40, width: 40 }} />
        </Badge>
        <Badge dot>
          <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 6, height: 40, width: 40 }} />
        </Badge>
        <Badge showZero count={0}>
          <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 6, height: 40, width: 40 }} />
        </Badge>
        <Badge count={4} size="small">
          <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 6, height: 40, width: 40 }} />
        </Badge>
      </Flexbox>
      <Flexbox horizontal gap={24}>
        <Badge count={12} />
        <Badge count={128} overflowCount={99} />
      </Flexbox>
    </Flexbox>
  );
};
