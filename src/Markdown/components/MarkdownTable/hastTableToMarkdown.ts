type HastNode = {
  children?: HastNode[];
  properties?: Record<string, any>;
  tagName?: string;
  type: string;
  value?: string;
};

const escapeCell = (text: string) => text.replaceAll('|', '\\|').replaceAll(/\r?\n/g, '<br>');

const readAlign = (node: HastNode | undefined): 'center' | 'left' | 'right' | null => {
  const style = node?.properties?.style;
  const align = node?.properties?.align;
  const haystack = typeof style === 'string' ? style.toLowerCase() : '';
  const explicit = typeof align === 'string' ? align.toLowerCase() : '';
  const value = haystack || explicit;
  if (value.includes('center')) return 'center';
  if (value.includes('right')) return 'right';
  if (value.includes('left')) return 'left';
  return null;
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
      return `\`${inner}\``;
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
