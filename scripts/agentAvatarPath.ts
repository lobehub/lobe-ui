/** Flattens SVG paths into polygons, for baking and checking AgentAvatar geometry. */
type P = [number, number];

const flattenArc = (
  [x0, y0]: P,
  rx0: number,
  ry0: number,
  degrees: number,
  large: number,
  sweep: number,
  [x, y]: P,
): P[] => {
  if (!rx0 || !ry0) return [[x, y]];
  const phi = (degrees * Math.PI) / 180;
  const [c, s] = [Math.cos(phi), Math.sin(phi)];
  const [dx, dy] = [(x0 - x) / 2, (y0 - y) / 2];
  const [xp, yp] = [c * dx + s * dy, -s * dx + c * dy];
  let [rx, ry] = [Math.abs(rx0), Math.abs(ry0)];
  const scale = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
  if (scale > 1) [rx, ry] = [rx * Math.sqrt(scale), ry * Math.sqrt(scale)];
  const denominator = rx * rx * yp * yp + ry * ry * xp * xp;
  const k =
    (large === sweep ? -1 : 1) *
    Math.sqrt(Math.max(0, (rx * rx * ry * ry - denominator) / denominator));
  const [cxp, cyp] = [(k * rx * yp) / ry, (-k * ry * xp) / rx];
  const [cx, cy] = [c * cxp - s * cyp + (x0 + x) / 2, s * cxp + c * cyp + (y0 + y) / 2];
  const start = Math.atan2((yp - cyp) / ry, (xp - cxp) / rx);
  let delta = Math.atan2((-yp - cyp) / ry, (-xp - cxp) / rx) - start;
  if (sweep && delta < 0) delta += Math.PI * 2;
  if (!sweep && delta > 0) delta -= Math.PI * 2;
  const steps = Math.max(8, Math.ceil(Math.abs(delta) / (Math.PI / 24)));
  return Array.from({ length: steps }, (_, index) => {
    const t = start + (delta * (index + 1)) / steps;
    return [
      cx + c * rx * Math.cos(t) - s * ry * Math.sin(t),
      cy + s * rx * Math.cos(t) + c * ry * Math.sin(t),
    ];
  });
};

/** Flatten an SVG path into closed rings. */
export const flatten = (d: string): P[][] => {
  const tokens = d.match(/[MLHVQTCAZ]|[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi)!;
  const rings: P[][] = [];
  let ring: P[] = [];
  let [index, command, x, y, startX, startY, controlX, controlY, last] = [
    0,
    '',
    0,
    0,
    0,
    0,
    0,
    0,
    '',
  ] as [number, string, number, number, number, number, number, number, string];
  const next = () => Number(tokens[index++]);
  const quad = (cx: number, cy: number, ex: number, ey: number) => {
    for (let step = 1; step <= 10; step++) {
      const [u, v] = [step / 10, 1 - step / 10];
      ring.push([v * v * x + 2 * v * u * cx + u * u * ex, v * v * y + 2 * v * u * cy + u * u * ey]);
    }
    [controlX, controlY, x, y] = [cx, cy, ex, ey];
  };
  while (index < tokens.length) {
    if (/^[a-z]$/i.test(tokens[index])) command = tokens[index++];
    const relative = command === command.toLowerCase();
    const type = command.toUpperCase();
    const [ox, oy] = relative ? [x, y] : [0, 0];
    if (type === 'Z') {
      if (ring.length > 0) rings.push(ring);
      ring = [];
      [x, y, command, last] = [startX, startY, '', 'Z'];
      continue;
    }
    if (type === 'M') {
      if (ring.length > 0) rings.push(ring);
      [x, y] = [ox + next(), oy + next()];
      [startX, startY] = [x, y];
      ring = [[x, y]];
      command = relative ? 'l' : 'L';
    } else if (type === 'L') {
      [x, y] = [ox + next(), oy + next()];
      ring.push([x, y]);
    } else if (type === 'H') {
      x = ox + next();
      ring.push([x, y]);
    } else if (type === 'V') {
      y = oy + next();
      ring.push([x, y]);
    } else if (type === 'Q') {
      quad(ox + next(), oy + next(), ox + next(), oy + next());
    } else if (type === 'T') {
      const smooth = last === 'Q' || last === 'T';
      quad(smooth ? 2 * x - controlX : x, smooth ? 2 * y - controlY : y, ox + next(), oy + next());
    } else if (type === 'C') {
      const [a, b, e, f, g, h] = [
        ox + next(),
        oy + next(),
        ox + next(),
        oy + next(),
        ox + next(),
        oy + next(),
      ];
      for (let step = 1; step <= 12; step++) {
        const [u, v] = [step / 12, 1 - step / 12];
        ring.push([
          v * v * v * x + 3 * v * v * u * a + 3 * v * u * u * e + u * u * u * g,
          v * v * v * y + 3 * v * v * u * b + 3 * v * u * u * f + u * u * u * h,
        ]);
      }
      [x, y] = [g, h];
    } else if (type === 'A') {
      const [rx, ry, rotation, large, sweep] = [next(), next(), next(), next(), next()];
      const end: P = [ox + next(), oy + next()];
      ring.push(...flattenArc([x, y], rx, ry, rotation, large, sweep, end));
      [x, y] = end;
    } else {
      throw new Error(`Unsupported path command ${command}`);
    }
    last = type;
  }
  if (ring.length > 0) rings.push(ring);
  return rings;
};
