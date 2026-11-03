export interface TocPathRow {
  bottom: number;
  level: 2 | 3;
  top: number;
}

export interface TocPath {
  d: string;
  length: number;
  ranges: Array<[start: number, end: number]>;
}

interface Point {
  x: number;
  y: number;
}

export const TOC_TRACK_X = 1;
export const TOC_NESTED_TRACK_X = 13;
const ROW_INSET = 6;
const BEND_RADIUS = 5;
const CURVE_SAMPLES = 16;

const round = (value: number) => Math.round(value * 100) / 100;

const quadraticLength = (from: Point, control: Point, to: Point) => {
  let total = 0;
  let previous = from;
  for (let step = 1; step <= CURVE_SAMPLES; step += 1) {
    const t = step / CURVE_SAMPLES;
    const u = 1 - t;
    const next = {
      x: u * u * from.x + 2 * u * t * control.x + t * t * to.x,
      y: u * u * from.y + 2 * u * t * control.y + t * t * to.y,
    };
    total += Math.hypot(next.x - previous.x, next.y - previous.y);
    previous = next;
  }
  return total;
};

export const buildTocPath = (rows: TocPathRow[]): TocPath => {
  if (rows.length === 0) return { d: '', length: 0, ranges: [] };

  const points = rows.flatMap((row) => {
    const x = row.level === 3 ? TOC_NESTED_TRACK_X : TOC_TRACK_X;
    return [
      { x, y: row.top + ROW_INSET },
      { x, y: row.bottom - ROW_INSET },
    ];
  });

  let d = `M${points[0].x} ${points[0].y}`;
  let length = 0;
  let cursor = points[0];
  const offsets = [0];

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    const previous = points[index - 1];
    const next = points[index + 1];
    const inX = point.x - previous.x;
    const inY = point.y - previous.y;
    const bends = next !== undefined && (next.x - point.x) * inY - (next.y - point.y) * inX !== 0;

    if (!bends) {
      length += Math.hypot(point.x - cursor.x, point.y - cursor.y);
      d += ` L${point.x} ${point.y}`;
      offsets.push(length);
      cursor = point;
      continue;
    }

    const inLength = Math.hypot(inX, inY);
    const outX = next.x - point.x;
    const outY = next.y - point.y;
    const outLength = Math.hypot(outX, outY);
    const radius = Math.min(BEND_RADIUS, inLength / 2, outLength / 2);
    const entry = {
      x: point.x - (inX / inLength) * radius,
      y: point.y - (inY / inLength) * radius,
    };
    const exit = {
      x: point.x + (outX / outLength) * radius,
      y: point.y + (outY / outLength) * radius,
    };
    const curve = quadraticLength(entry, point, exit);

    length += Math.hypot(entry.x - cursor.x, entry.y - cursor.y);
    d += ` L${round(entry.x)} ${round(entry.y)} Q${point.x} ${point.y} ${round(exit.x)} ${round(exit.y)}`;
    offsets.push(length + curve / 2);
    length += curve;
    cursor = exit;
  }

  const ranges = rows.map(
    (_, index) =>
      [round(offsets[index * 2]), round(offsets[index * 2 + 1])] as [start: number, end: number],
  );

  return { d, length: round(length), ranges };
};
