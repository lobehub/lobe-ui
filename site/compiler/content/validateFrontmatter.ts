import type { ContentFrontmatter, DocumentStatus } from '../../types/content';

const statuses = new Set<DocumentStatus>(['stable', 'beta', 'experimental', 'deprecated']);

export interface FrontmatterValidationResult {
  diagnostics: string[];
  frontmatter?: ContentFrontmatter;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readRequiredString = (
  record: Record<string, unknown>,
  field: 'description' | 'title',
  diagnostics: string[],
): string | undefined => {
  const value = record[field];
  if (typeof value === 'string' && value.trim()) return value.trim();
  diagnostics.push(`missing or invalid required field "${field}"`);
  return undefined;
};

const readOptionalString = (
  record: Record<string, unknown>,
  field: 'category' | 'route' | 'since',
  diagnostics: string[],
): string | undefined => {
  const value = record[field];
  if (value === undefined) return undefined;
  if (typeof value === 'string' && value.trim()) return value.trim();
  diagnostics.push(`field "${field}" must be a non-empty string`);
  return undefined;
};

export function validateFrontmatter(
  value: unknown,
  options: { requireCategory: boolean },
): FrontmatterValidationResult {
  if (!isRecord(value)) {
    return { diagnostics: ['frontmatter must be a YAML mapping'] };
  }

  const diagnostics: string[] = [];
  const title = readRequiredString(value, 'title', diagnostics);
  const description = readRequiredString(value, 'description', diagnostics);
  const category = readOptionalString(value, 'category', diagnostics);

  if (options.requireCategory && !category) {
    diagnostics.push('missing or invalid required field "category"');
  }

  const route = readOptionalString(value, 'route', diagnostics);
  if (route && !route.startsWith('/')) diagnostics.push('field "route" must begin with "/"');

  const since = readOptionalString(value, 'since', diagnostics);
  const order = value.order;
  if (order !== undefined && (typeof order !== 'number' || !Number.isFinite(order))) {
    diagnostics.push('field "order" must be a finite number');
  }

  const status = value.status;
  if (
    status !== undefined &&
    (typeof status !== 'string' || !statuses.has(status as DocumentStatus))
  ) {
    diagnostics.push('field "status" must be stable, beta, experimental, or deprecated');
  }

  if (diagnostics.length > 0 || !title || !description) return { diagnostics };

  return {
    diagnostics,
    frontmatter: {
      ...(category ? { category } : {}),
      description,
      ...(typeof order === 'number' ? { order } : {}),
      ...(route ? { route } : {}),
      ...(since ? { since } : {}),
      ...(typeof status === 'string' ? { status: status as DocumentStatus } : {}),
      title,
    },
  };
}
