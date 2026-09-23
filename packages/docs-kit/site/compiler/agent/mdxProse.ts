const frontmatterPattern = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;

const fencePattern = /```[\s\S]*?```|~~~[\s\S]*?~~~/g;

const shieldFences = (source: string): { fences: string[]; text: string } => {
  const fences: string[] = [];
  const text = source.replaceAll(fencePattern, (fence) => {
    const token = `%%DOCS_KIT_FENCE_${fences.length}%%`;
    fences.push(fence);
    return token;
  });
  return { fences, text };
};

const restoreFences = (source: string, fences: readonly string[]): string =>
  source.replaceAll(/%%DOCS_KIT_FENCE_(\d+)%%/g, (_, index: string) => fences[Number(index)] ?? '');

const stripComponentJsx = (source: string): string =>
  source
    .replaceAll(/<[A-Z][\s\S]*?\/>/g, '')
    .replaceAll(/<[A-Z][^>\n]*>[\s\S]*?<\/[A-Z][A-Za-z0-9.]*>/g, '');

const dropEmptyHeadings = (source: string): string => {
  const lines = source.split('\n');
  const kept: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    if (!/^#{1,6}\s/.test(line)) {
      kept.push(line);
      continue;
    }

    let next = index + 1;
    while (next < lines.length && (lines[next] ?? '').trim() === '') next += 1;
    if (next >= lines.length || /^#{1,6}\s/.test(lines[next] ?? '')) {
      index = next - 1;
      continue;
    }
    kept.push(line);
  }

  return kept.join('\n');
};

export interface MdxProse {
  headings: string[];
  prose: string;
}

/**
 * Keeps the markdown an author wrote in a component or guide MDX file.
 * Import lines and component tags such as `<Demo />` and `<Api />` are omitted.
 */
export function extractMdxProse(contents: string): MdxProse {
  const body = contents.replace(frontmatterPattern, '');
  const { fences, text } = shieldFences(body);
  const stripped = stripComponentJsx(text)
    .split('\n')
    .filter((line) => !/^[\t ]*(?:import|export)\s/.test(line))
    .join('\n');
  const prose = dropEmptyHeadings(restoreFences(stripped, fences))
    .replaceAll(/[ \t]+\n/g, '\n')
    .replaceAll(/\n{3,}/g, '\n\n')
    .trim();
  const headings = prose.split('\n').flatMap((line) => {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    return match?.[2] ? [match[2].trim()] : [];
  });

  return { headings, prose };
}
