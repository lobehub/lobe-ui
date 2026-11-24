import { DiffStat, type DiffStatKind, Flexbox, Text } from '@lobehub/ui';

const files: { additions: number; deletions: number; kind: DiffStatKind; name: string }[] = [
  { additions: 74, deletions: 41, kind: 'modified', name: 'ChurnSchedule.tsx' },
  { additions: 13, deletions: 0, kind: 'added', name: 'flavors.css' },
  { additions: 0, deletions: 28, kind: 'deleted', name: 'legacy-menu.ts' },
  { additions: 0, deletions: 0, kind: 'renamed', name: 'menu.ts' },
];

export default () => (
  <Flexbox gap={8} padding={24} style={{ width: 320 }}>
    {files.map((file) => (
      <Flexbox horizontal align="center" justify="space-between" key={file.name}>
        <Text code fontSize={12}>
          {file.name}
        </Text>
        <DiffStat hideZero additions={file.additions} deletions={file.deletions} kind={file.kind} />
      </Flexbox>
    ))}
    <Flexbox horizontal align="center" justify="space-between">
      <Text type="secondary">Total</Text>
      <DiffStat additions={87} deletions={69} />
    </Flexbox>
  </Flexbox>
);
