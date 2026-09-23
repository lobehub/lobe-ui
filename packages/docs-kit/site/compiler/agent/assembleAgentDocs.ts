import type { AtomDirConfig } from '../../../src/config';
import type { DocumentManifestEntry } from '../../types/content';
import type { MdxProse } from './mdxProse';

export interface AgentSiteInfo {
  atomDirs: readonly AtomDirConfig[];
  description: string;
  install?: string;
  navSections: Record<string, string>;
  origin: string;
  packageName?: string;
  repository?: string;
  title: string;
}

export interface AgentPage {
  markdown: string;
  pathname: string;
}

export interface AssembledAgentDocs {
  llmsTxt: string;
  pages: AgentPage[];
  skillsMd: string;
}

const emptyProse: MdxProse = { headings: [], prose: '' };

const oneLine = (value: string): string => value.replaceAll(/\s+/g, ' ').trim();

const linkLabel = (value: string): string =>
  oneLine(value).replaceAll('[', '\\[').replaceAll(']', '\\]');

export const absoluteUrl = (origin: string, pathname: string): string =>
  new URL(pathname, origin).href;

export const AGENT_PAGE_BASE_PATHNAME = '/skills';

const isOptionalPathname = (pathname: string): boolean =>
  pathname === '/' || pathname === '/changelog';

export const agentPagePathname = (pathname: string): string => {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return `${AGENT_PAGE_BASE_PATHNAME}${normalized === '/' ? '/index' : normalized}.md`;
};

export const listAgentPagePathnames = (
  documents: readonly Pick<DocumentManifestEntry, 'pathname'>[],
): string[] =>
  documents
    .filter(({ pathname }) => !isOptionalPathname(pathname))
    .map(({ pathname }) => agentPagePathname(pathname));

export const skillNameFromTitle = (title: string): string => {
  const slug = title
    .normalize('NFKD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
    .replaceAll(/-{2,}/g, '-')
    .slice(0, 64)
    .replaceAll(/-+$/g, '');
  return slug || 'docs';
};

const atomLabel = (atomDir: AtomDirConfig): string =>
  atomDir.subType ?? atomDir.type ?? atomDir.dir;

const matchingAtomDir = (
  source: string,
  atomDirs: readonly AtomDirConfig[],
): AtomDirConfig | undefined =>
  atomDirs.find((atomDir) => source === atomDir.dir || source.startsWith(`${atomDir.dir}/`));

interface PreparedPage extends DocumentManifestEntry {
  docsUrl: string;
  group: string;
  headings: string[];
  kind: 'component' | 'guide' | 'optional';
  pageUrl: string;
  prose: string;
}

const pageKind = (pathname: string, atomDir: AtomDirConfig | undefined): PreparedPage['kind'] => {
  if (isOptionalPathname(pathname)) return 'optional';
  if (!atomDir) return 'guide';
  return 'component';
};

const folderWithinAtom = (source: string, atomDir: AtomDirConfig | undefined): string => {
  if (!atomDir) return source.replace(/\.mdx?$/, '');
  return source
    .slice(atomDir.dir.length + 1)
    .replace(/\/index\.mdx?$/, '')
    .replace(/\.mdx?$/, '');
};

const groupForPage = (
  source: string,
  folder: string,
  atomDir: AtomDirConfig | undefined,
  navSections: Record<string, string>,
): string => {
  const override = navSections[source];
  if (override) return override;
  if (!atomDir) return 'Guides';
  const segments = folder.split('/').filter(Boolean);
  if (segments.length <= 1) return atomLabel(atomDir);
  return segments[0] ?? atomLabel(atomDir);
};

const comparePages = (left: PreparedPage, right: PreparedPage): number => {
  const orderDifference =
    (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
  if (orderDifference !== 0) return orderDifference;
  return (
    left.title.localeCompare(right.title, 'en') || left.pathname.localeCompare(right.pathname, 'en')
  );
};

const preparePages = (
  site: AgentSiteInfo,
  documents: readonly DocumentManifestEntry[],
  proseBySource: ReadonlyMap<string, MdxProse>,
): PreparedPage[] =>
  documents.map((document) => {
    const atomDir = matchingAtomDir(document.source, site.atomDirs);
    const folder = folderWithinAtom(document.source, atomDir);
    const prose = proseBySource.get(document.source) ?? emptyProse;
    const docsUrl = absoluteUrl(site.origin, document.pathname);
    const kind = pageKind(document.pathname, atomDir);
    return {
      ...document,
      docsUrl,
      group: groupForPage(document.source, folder, atomDir, site.navSections),
      headings: prose.headings,
      kind,
      pageUrl:
        kind === 'optional'
          ? docsUrl
          : absoluteUrl(site.origin, agentPagePathname(document.pathname)),
      prose: prose.prose,
    };
  });

const compareGroups = (left: string, right: string, atomLabels: readonly string[]): number => {
  const rank = (group: string) => {
    if (group === 'Guides') return -1;
    const index = atomLabels.indexOf(group);
    return index === -1 ? atomLabels.length : index;
  };
  const rankDifference = rank(left) - rank(right);
  if (rankDifference !== 0) return rankDifference;
  return left.localeCompare(right, 'en');
};

const pagesByGroup = (pages: readonly PreparedPage[]): Map<string, PreparedPage[]> => {
  const groups = new Map<string, PreparedPage[]>();
  for (const page of pages) {
    const list = groups.get(page.group) ?? [];
    list.push(page);
    groups.set(page.group, list);
  }
  for (const list of groups.values()) list.sort(comparePages);
  return groups;
};

const orderedGroupNames = (
  groups: ReadonlyMap<string, PreparedPage[]>,
  atomLabels: readonly string[],
): string[] => [...groups.keys()].toSorted((left, right) => compareGroups(left, right, atomLabels));

const pageNote = (page: PreparedPage): string => {
  const outline = page.headings.slice(0, 12).join(', ');
  return [
    page.category ? `Category: ${oneLine(page.category)}.` : '',
    oneLine(page.description),
    outline ? `Outline: ${outline}.` : '',
    `Docs: ${page.docsUrl}`,
  ]
    .filter(Boolean)
    .join(' ');
};

const fileList = (pages: readonly PreparedPage[]): string[] =>
  pages.map((page) => `- [${linkLabel(page.title)}](${page.pageUrl}): ${pageNote(page)}`);

const quote = (value: string): string => JSON.stringify(oneLine(value));

const skillDescription = (site: AgentSiteInfo): string => {
  const summary = oneLine(site.description) || `Documentation for ${oneLine(site.title)}.`;
  const composed = `${summary} Use when choosing a component, looking up its props and API, or implementing UI with it.`;
  return composed.length <= 1024 ? composed : `${composed.slice(0, 1021).trimEnd()}...`;
};

const SHORT_DESCRIPTION_LENGTH = 140;

const shortDescription = (value: string): string => {
  const text = oneLine(value);
  const sentence = /^.+?[.!?](?=\s|$)/.exec(text)?.[0] ?? text;
  if (sentence.length <= SHORT_DESCRIPTION_LENGTH) return sentence;
  return `${sentence.slice(0, SHORT_DESCRIPTION_LENGTH - 1).trimEnd()}…`;
};

const codeFence = (language: string, source: string): string => {
  const fence = source.includes('```') ? '~~~' : '```';
  return [fence + language, source.trim(), fence].join('\n');
};

const setupLines = (site: AgentSiteInfo): string[] => {
  const lines: string[] = [];
  if (site.packageName) lines.push(`- Package: \`${site.packageName}\``);
  if (site.repository) lines.push(`- Repository: ${site.repository}`);
  lines.push(`- Docs: ${absoluteUrl(site.origin, '/')}`);
  if (site.install) lines.push('', codeFence('bash', site.install));
  return ['## Setup', '', ...lines, ''];
};

const indexEntry = (page: PreparedPage): string => {
  const description = shortDescription(page.description);
  return `- [${linkLabel(page.title)}](${page.pageUrl})${description ? ` — ${description}` : ''}`;
};

const indexLines = (
  groups: ReadonlyMap<string, PreparedPage[]>,
  groupNames: readonly string[],
): string[] => {
  const lines = ['## Index', ''];
  for (const group of groupNames) {
    const pages = groups.get(group) ?? [];
    lines.push(`### ${group}`, '');
    const categories = new Map<string, PreparedPage[]>();
    for (const page of pages) {
      const category = oneLine(page.category ?? '');
      categories.set(category, [...(categories.get(category) ?? []), page]);
    }
    if (categories.size <= 1) {
      lines.push(...pages.map(indexEntry), '');
      continue;
    }
    const names = [...categories.keys()].toSorted(
      (left, right) => Number(!left) - Number(!right) || left.localeCompare(right, 'en'),
    );
    for (const category of names) {
      lines.push(
        `#### ${category || 'Other'}`,
        '',
        ...(categories.get(category) ?? []).map(indexEntry),
        '',
      );
    }
  }
  return lines;
};

const pageMarkdown = (page: PreparedPage, skillsUrl: string): string => {
  const meta = [
    `- Source: \`${page.source}\``,
    page.category ? `- Category: ${oneLine(page.category)}` : '',
    page.status && page.status !== 'stable' ? `- Status: ${page.status}` : '',
    page.since ? `- Since: ${page.since}` : '',
    `- Docs: ${page.docsUrl}`,
    `- Index: ${skillsUrl}`,
  ].filter(Boolean);
  const description = oneLine(page.description);

  return [
    `# ${oneLine(page.title)}`,
    '',
    description ? `> ${description}` : '',
    '',
    ...meta,
    '',
    page.prose,
    '',
  ]
    .join('\n')
    .replaceAll(/\n{3,}/g, '\n\n');
};

export function assembleAgentDocs({
  documents,
  proseBySource,
  site,
}: {
  documents: readonly DocumentManifestEntry[];
  proseBySource: ReadonlyMap<string, MdxProse>;
  site: AgentSiteInfo;
}): AssembledAgentDocs {
  const pages = preparePages(site, documents, proseBySource);
  const optional = pages.filter((page) => page.kind === 'optional').toSorted(comparePages);
  const atomLabels = site.atomDirs.map(atomLabel);
  const referenceGroups = pagesByGroup(pages.filter((page) => page.kind !== 'optional'));
  const referenceGroupNames = orderedGroupNames(referenceGroups, atomLabels);
  const summary = oneLine(site.description) || `Documentation for ${oneLine(site.title)}.`;
  const skillsUrl = absoluteUrl(site.origin, '/skills.md');
  const llmsUrl = absoluteUrl(site.origin, '/llms.txt');
  const llmsSections = [
    ...referenceGroupNames.map((group) => [group, referenceGroups.get(group) ?? []] as const),
    ...(optional.length > 0 ? [['Optional', optional] as const] : []),
  ];

  const llmsTxt = [
    `# ${oneLine(site.title)}`,
    '',
    `> ${summary}`,
    '',
    'Each entry links to a markdown reference page assembled from its MDX source; the Docs URL is the rendered page with live demos.',
    '',
    `Agent skill entry point: [skills.md](${skillsUrl}).`,
    '',
    ...llmsSections.flatMap(([group, groupPages]) => [
      `## ${group}`,
      '',
      ...fileList(groupPages),
      '',
    ]),
    '',
  ]
    .join('\n')
    .replaceAll(/\n{3,}/g, '\n\n');

  const skillsMd = [
    '---',
    `name: ${skillNameFromTitle(site.title)}`,
    `description: ${quote(skillDescription(site))}`,
    '---',
    '',
    `# ${oneLine(site.title)}`,
    '',
    `> ${summary}`,
    '',
    ...setupLines(site),
    '## Workflow',
    '',
    '1. Pick candidates from the index below. Groups follow the source folder, which usually maps to the import entry.',
    '2. Fetch the linked reference page before writing code. It holds the documented usage, props and API tables.',
    '3. Only use props, variants and imports that the reference page documents. Follow its Docs link to see live demos.',
    '',
    `The page index with outlines is at ${llmsUrl}.`,
    '',
    ...indexLines(referenceGroups, referenceGroupNames),
    '',
  ]
    .join('\n')
    .replaceAll(/\n{3,}/g, '\n\n');

  return {
    llmsTxt,
    pages: pages
      .filter((page) => page.kind !== 'optional')
      .map((page) => ({
        markdown: pageMarkdown(page, skillsUrl),
        pathname: agentPagePathname(page.pathname),
      })),
    skillsMd,
  };
}
