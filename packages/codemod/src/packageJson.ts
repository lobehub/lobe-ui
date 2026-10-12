import { DOCS_URL, type ReportItem } from './report';

const DEPENDENCY_FIELDS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

const MIN_MAJOR: Record<string, { beta: boolean; major: number }> = {
  '@lobehub/fluent-emoji': { beta: true, major: 5 },
  '@lobehub/icons': { beta: true, major: 6 },
  '@lobehub/ui': { beta: true, major: 6 },
  'motion': { beta: false, major: 13 },
};

const majorOf = (range: string) => {
  const match = /(\d+)/.exec(range);
  return match ? Number(match[1]) : undefined;
};

const messageFor = (name: string, range: string) => {
  if (name === 'antd-style') return 'Remove `antd-style`: import its helpers from @lobehub/ui.';
  if (name === 'antd' || name.startsWith('@ant-design/')) {
    return `Remove \`${name}\`: @lobehub/ui 6 does not use it.`;
  }
  const min = MIN_MAJOR[name];
  const major = majorOf(range);
  if (!min || major === undefined || major >= min.major) return;
  return `Bump \`${name}\` to ^${min.major}${min.beta ? ' (`@beta` during the beta)' : ''}.`;
};

export const checkPackageJson = (text: string, file: string): ReportItem[] => {
  const pkg = JSON.parse(text);
  const lines = text.split('\n');
  const items: ReportItem[] = [];
  for (const field of DEPENDENCY_FIELDS) {
    const fieldIndex = Math.max(
      0,
      lines.findIndex((line) => line.includes(`"${field}"`)),
    );
    for (const [name, range] of Object.entries<string>(pkg[field] ?? {})) {
      const message = messageFor(name, range);
      if (!message) continue;
      const offset = lines.slice(fieldIndex).findIndex((line) => line.includes(`"${name}"`));
      const index = offset === -1 ? -1 : fieldIndex + offset;
      items.push({
        anchor: `${DOCS_URL}#upgrade-steps`,
        column: index === -1 ? 1 : lines[index].indexOf(`"${name}"`) + 1,
        file,
        level: 'error',
        line: index + 1,
        message,
        rule: 'R7',
        snippet: index === -1 ? name : lines[index].trim(),
      });
    }
  }
  return items;
};
