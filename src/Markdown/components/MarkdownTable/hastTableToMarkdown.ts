type HastNode = {
  children?: HastNode[];
  properties?: Record<string, any>;
  tagName?: string;
  type: string;
  value?: string;
};

const escapeCell = (text: string) => text.replaceAll('|', '\\|').replaceAll(/\r?\n/g, '<br>');

const matchAlign = (source: string): 'center' | 'left' | 'right' | null => {
  if (source.includes('center')) return 'center';
  if (source.includes('right')) return 'right';
  if (source.includes('left')) return 'left';
  return null;
};

const readAlign = (node: HastNode | undefined): 'center' | 'left' | 'right' | null => {
  const style = node?.properties?.style;
  const align = node?.properties?.align;
  const styleStr = typeof style === 'string' ? style.toLowerCase() : '';
  const alignStr = typeof align === 'string' ? align.toLowerCase() : '';
  // Prefer the inline style hint (more specific) but fall back to the
  // explicit `align` attribute when style has no alignment keyword —
  // otherwise an unrelated style like `color: red` would suppress
  // `align="right"`.
  return matchAlign(styleStr) ?? matchAlign(alignStr);
};

// CommonMark code-span rule: open and close with N backticks where N is
// longer than any run of consecutive backticks inside the content. If the
// content starts or ends with a backtick, pad with a single space on each
// side (the parser strips one space when both sides are padded).
const encodeInlineCode = (text: string): string => {
  let longestRun = 0;
  const runs = text.match(/`+/g);
  if (runs) for (const run of runs) longestRun = Math.max(longestRun, run.length);
  const fence = '`'.repeat(longestRun + 1);
  const needsPad = text.startsWith('`') || text.endsWith('`');
  const body = needsPad ? ` ${text} ` : text;
  return `${fence}${body}${fence}`;
};

const renderInline = (node: HastNode): string => {
  if (node.type === 'text') return node.value ?? '';
  if (node.type !== 'element') return '';

  const inner = (node.children ?? []).map((child) => renderInline(child)).join('');

  switch (node.tagName) {
    case 'br': {
      return '<br>';
    }
    case 'code': {
      return encodeInlineCode(inner);
    }
    case 'strong':
    case 'b': {
      return `**${inner}**`;
    }
    case 'em':
    case 'i': {
      return `*${inner}*`;
    }
    case 'del':
    case 's': {
      return `~~${inner}~~`;
    }
    case 'a': {
      const href = node.properties?.href;
      return href ? `[${inner}](${href})` : inner;
    }
    case 'img': {
      const src = node.properties?.src ?? '';
      const alt = node.properties?.alt ?? '';
      return `![${alt}](${src})`;
    }
    default: {
      return inner;
    }
  }
};

const renderCell = (cell: HastNode): string => escapeCell(renderInline(cell)).trim();

const findChild = (node: HastNode | undefined, tag: string): HastNode | undefined =>
  node?.children?.find((child) => child.type === 'element' && child.tagName === tag);

const findAllChildren = (node: HastNode | undefined, tag: string): HastNode[] =>
  (node?.children ?? []).filter((child) => child.type === 'element' && child.tagName === tag);

const getRowCells = (row: HastNode): HastNode[] =>
  (row.children ?? []).filter(
    (child) => child.type === 'element' && (child.tagName === 'th' || child.tagName === 'td'),
  );

const alignToDivider = (align: 'center' | 'left' | 'right' | null): string => {
  switch (align) {
    case 'center': {
      return ':---:';
    }
    case 'left': {
      return ':---';
    }
    case 'right': {
      return '---:';
    }
    default: {
      return '---';
    }
  }
};

export const hastTableToMarkdown = (node: HastNode | undefined): string => {
  if (!node) return '';

  const thead = findChild(node, 'thead');
  const tbody = findChild(node, 'tbody');

  const headerRow = findChild(thead, 'tr');
  const headerCells = headerRow ? getRowCells(headerRow) : [];

  const bodyRows = findAllChildren(tbody, 'tr');
  const columnCount = Math.max(
    headerCells.length,
    ...bodyRows.map((row) => getRowCells(row).length),
  );

  if (columnCount === 0) return '';

  const headerTexts = Array.from({ length: columnCount }, (_, i) =>
    headerCells[i] ? renderCell(headerCells[i]) : '',
  );

  const aligns = Array.from({ length: columnCount }, (_, i) => readAlign(headerCells[i]));

  const headerLine = `| ${headerTexts.join(' | ')} |`;
  const dividerLine = `| ${aligns.map((a) => alignToDivider(a)).join(' | ')} |`;
  const bodyLines = bodyRows.map((row) => {
    const cells = getRowCells(row);
    const texts = Array.from({ length: columnCount }, (_, i) =>
      cells[i] ? renderCell(cells[i]) : '',
    );
    return `| ${texts.join(' | ')} |`;
  });

  return [headerLine, dividerLine, ...bodyLines].join('\n');
};
