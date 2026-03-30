interface MermaidVisualTokens {
  borderRadius: number;
  labelBackground: string;
  labelBorder: string;
  labelPillRadius: number;
  labelText: string;
  noteBackground: string;
  noteBorder: string;
  noteText: string;
}

function clampRoundedRectRadius(width: number, height: number, radius: number) {
  return Math.max(0, Math.min(radius, width / 2, height / 2));
}

function createRoundedRectPathD(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const roundedRadius = clampRoundedRectRadius(width, height, radius);

  return [
    `M ${x + roundedRadius} ${y}`,
    `H ${x + width - roundedRadius}`,
    `A ${roundedRadius} ${roundedRadius} 0 0 1 ${x + width} ${y + roundedRadius}`,
    `V ${y + height - roundedRadius}`,
    `A ${roundedRadius} ${roundedRadius} 0 0 1 ${x + width - roundedRadius} ${y + height}`,
    `H ${x + roundedRadius}`,
    `A ${roundedRadius} ${roundedRadius} 0 0 1 ${x} ${y + height - roundedRadius}`,
    `V ${y + roundedRadius}`,
    `A ${roundedRadius} ${roundedRadius} 0 0 1 ${x + roundedRadius} ${y}`,
    'Z',
  ].join(' ');
}

function createRoundedPolygonPathD(points: string, radius: number): string | null {
  const vertices = points
    .trim()
    .split(/\s+/)
    .map((p) => {
      const [x, y] = p.split(',').map(Number);
      return { x: x!, y: y! };
    });

  if (vertices.length < 3) return null;

  const n = vertices.length;
  const segments: string[] = [];

  for (let i = 0; i < n; i++) {
    const prev = vertices[(i - 1 + n) % n]!;
    const curr = vertices[i]!;
    const next = vertices[(i + 1) % n]!;

    const dx1 = prev.x - curr.x;
    const dy1 = prev.y - curr.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    const len1 = Math.hypot(dx1, dy1);
    const len2 = Math.hypot(dx2, dy2);
    if (len1 === 0 || len2 === 0) return null;

    const r = Math.min(radius, len1 / 2, len2 / 2);

    const startX = curr.x + (dx1 / len1) * r;
    const startY = curr.y + (dy1 / len1) * r;
    const endX = curr.x + (dx2 / len2) * r;
    const endY = curr.y + (dy2 / len2) * r;

    if (i === 0) {
      segments.push(`M ${startX} ${startY}`);
    } else {
      segments.push(`L ${startX} ${startY}`);
    }

    segments.push(`Q ${curr.x} ${curr.y} ${endX} ${endY}`);
  }

  segments.push('Z');
  return segments.join(' ');
}

function extractRectangleBoundsFromPath(pathData: string) {
  const numbers = pathData.match(/-?\d*\.?\d+/g)?.map(Number);
  if (!numbers || numbers.length < 8 || numbers.length % 2 !== 0) return null;

  const points: Array<{ x: number; y: number }> = [];
  for (let index = 0; index < numbers.length; index += 2) {
    const x = numbers[index];
    const y = numbers[index + 1];
    if (x === undefined || y === undefined) return null;
    points.push({ x, y });
  }

  const uniqueX = [...new Set(points.map((point) => Math.round(point.x * 100) / 100))];
  const uniqueY = [...new Set(points.map((point) => Math.round(point.y * 100) / 100))];
  if (uniqueX.length > 2 || uniqueY.length > 2) return null;

  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));

  return {
    height: maxY - minY,
    width: maxX - minX,
    x: minX,
    y: minY,
  };
}

function mergeInlineStyle(
  existingStyle: string,
  nextDeclarations: Record<string, string | number>,
): string {
  const styleMap = new Map<string, string>();

  for (const part of existingStyle
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)) {
    const separatorIndex = part.indexOf(':');
    if (separatorIndex === -1) continue;

    const property = part.slice(0, separatorIndex).trim().toLowerCase();
    const value = part.slice(separatorIndex + 1).trim();
    if (!property || !value) continue;

    styleMap.set(property, value);
  }

  for (const [property, value] of Object.entries(nextDeclarations)) {
    styleMap.set(property, String(value));
  }

  return Array.from(styleMap.entries())
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ');
}

function setRectPresentation(
  rect: SVGRectElement,
  {
    borderRadius,
    fill,
    stroke,
  }: {
    borderRadius: number;
    fill?: string;
    stroke?: string;
  },
) {
  rect.setAttribute('rx', String(borderRadius));
  rect.setAttribute('ry', String(borderRadius));
  if (fill) rect.setAttribute('fill', fill);
  if (stroke) rect.setAttribute('stroke', stroke);
}

function roundRectanglePaths(paths: NodeListOf<SVGPathElement>, radius: number) {
  paths.forEach((path) => {
    const pathData = path.getAttribute('d');
    if (!pathData) return;

    const bounds = extractRectangleBoundsFromPath(pathData);
    if (!bounds || bounds.width <= 0 || bounds.height <= 0) return;

    path.setAttribute(
      'd',
      createRoundedRectPathD(bounds.x, bounds.y, bounds.width, bounds.height, radius),
    );
  });
}

export function postProcessMermaidSvg(svg: string, tokens: MermaidVisualTokens): string {
  if (!svg) return svg;
  if (typeof DOMParser === 'undefined') return svg;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) return svg;

    const root = doc.documentElement;
    if (!root || root.localName !== 'svg') return svg;

    const styleEl = root.querySelector('style');
    if (styleEl) {
      styleEl.textContent =
        (styleEl.textContent || '') +
        '\n.edgeLabel, .edgeLabel p { background-color: transparent !important; }' +
        '\n.edgeLabel rect { opacity: 1 !important; }' +
        '\n.labelBkg { background-color: transparent !important; box-shadow: none !important; }';
    }

    const edgeLabelGroups = root.querySelectorAll<SVGGElement>('.edgeLabel g.label');
    edgeLabelGroups.forEach((labelGroup) => {
      const fo = labelGroup.querySelector('foreignObject');
      if (!fo) return;

      const foWidth = Number.parseFloat(fo.getAttribute('width') || '0');
      const foHeight = Number.parseFloat(fo.getAttribute('height') || '0');
      if (foWidth <= 0 || foHeight <= 0) return;

      const existingRect = labelGroup.querySelector('rect');
      if (existingRect) {
        setRectPresentation(existingRect, {
          borderRadius: tokens.labelPillRadius,
          fill: tokens.labelBackground,
          stroke: tokens.labelBorder,
        });
      } else {
        const actualRx = Math.min(tokens.labelPillRadius, foHeight / 2);
        const paddingX = Math.ceil(actualRx * 0.5);

        const rect = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(-paddingX));
        rect.setAttribute('y', '0');
        rect.setAttribute('width', String(foWidth + paddingX * 2));
        rect.setAttribute('height', String(foHeight));
        rect.setAttribute('rx', String(actualRx));
        rect.setAttribute('ry', String(actualRx));
        rect.setAttribute('fill', tokens.labelBackground);
        rect.setAttribute('stroke', tokens.labelBorder);
        rect.setAttribute('class', 'edge-label-pill');

        labelGroup.insertBefore(rect, labelGroup.firstChild);
      }
    });

    const labelBackgrounds = root.querySelectorAll<HTMLElement>('foreignObject .labelBkg');
    labelBackgrounds.forEach((el) => {
      const existing = el.getAttribute('style') ?? '';
      el.setAttribute(
        'style',
        mergeInlineStyle(existing, {
          'background-color': 'transparent',
          'box-shadow': 'none',
        }),
      );
    });

    const htmlEdgeLabels = root.querySelectorAll<HTMLElement>('foreignObject .edgeLabel');
    htmlEdgeLabels.forEach((el) => {
      const existing = el.getAttribute('style') ?? '';
      el.setAttribute(
        'style',
        mergeInlineStyle(existing, {
          'background-color': 'transparent',
          'color': tokens.labelText,
        }),
      );
    });

    const edgeLabelRects = root.querySelectorAll<SVGRectElement>(
      '.edgeLabel rect:not(.edge-label-pill), rect.labelBox',
    );
    edgeLabelRects.forEach((rect) => {
      setRectPresentation(rect, {
        borderRadius: tokens.labelPillRadius,
        fill: tokens.labelBackground,
        stroke: tokens.labelBorder,
      });
    });

    const noteRects = root.querySelectorAll<SVGRectElement>('rect.note, .note rect');
    noteRects.forEach((rect) => {
      setRectPresentation(rect, {
        borderRadius: tokens.borderRadius,
        fill: tokens.noteBackground,
        stroke: tokens.noteBorder,
      });
    });

    const noteTexts = root.querySelectorAll<SVGTextElement>('.noteText, .note text');
    noteTexts.forEach((text) => {
      text.setAttribute('fill', tokens.noteText);
    });

    roundRectanglePaths(
      root.querySelectorAll<SVGPathElement>(
        '.basic.label-container path, g.basic.label-container path, .node.note path',
      ),
      tokens.borderRadius,
    );

    root
      .querySelectorAll<SVGGElement>('g.basic.label-container, g.node.note')
      .forEach((container) => {
        const pathArray = Array.from(container.querySelectorAll<SVGPathElement>('path'));
        if (pathArray.length < 2) return;

        const isFillOnly = (p: SVGPathElement) =>
          p.getAttribute('fill') !== 'none' &&
          p.getAttribute('fill') !== null &&
          (p.getAttribute('stroke') === 'none' ||
            p.getAttribute('stroke') === null ||
            p.getAttribute('stroke-width') === '0');

        const isBorderOnly = (p: SVGPathElement) =>
          (!p.getAttribute('fill') || p.getAttribute('fill') === 'none') &&
          p.getAttribute('stroke') !== 'none' &&
          p.getAttribute('stroke') !== null &&
          p.getAttribute('stroke-width') !== '0';

        const fillPath = pathArray.find(isFillOnly);
        const borderPaths = pathArray.filter(isBorderOnly);

        if (!fillPath || borderPaths.length === 0) return;

        const donor = borderPaths[0];
        const stroke = donor.getAttribute('stroke');
        const strokeWidth = donor.getAttribute('stroke-width');
        if (stroke) fillPath.setAttribute('stroke', stroke);
        if (strokeWidth) fillPath.setAttribute('stroke-width', strokeWidth);

        for (const bp of borderPaths) {
          bp.remove();
        }
      });

    const roundedRectSelectors = [
      '.node > rect',
      '.node rect',
      '.node > .basic',
      '.classGroup > rect',
      '.classGroup rect',
      '.cluster > rect',
      '.actor',
      '.activation0',
      '.activation1',
      '.activation2',
      '.stateGroup rect',
      '.statediagram-state rect',
    ];
    root.querySelectorAll<SVGRectElement>(roundedRectSelectors.join(', ')).forEach((rect) => {
      setRectPresentation(rect, { borderRadius: tokens.borderRadius });
    });

    root.querySelectorAll<SVGPolygonElement>('.node polygon').forEach((polygon) => {
      const pts = polygon.getAttribute('points');
      if (!pts) return;

      const d = createRoundedPolygonPathD(pts, tokens.borderRadius);
      if (!d) return;

      const path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);

      for (const attr of Array.from(polygon.attributes)) {
        if (attr.name !== 'points') {
          path.setAttribute(attr.name, attr.value);
        }
      }

      polygon.replaceWith(path);
    });

    return new XMLSerializer().serializeToString(doc);
  } catch {
    return svg;
  }
}
