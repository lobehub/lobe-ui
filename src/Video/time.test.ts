import {
  formatTime,
  frameOf,
  markersAt,
  mergeSegments,
  sectionAt,
  sortSections,
  steppedTime,
} from './time';

describe('formatTime', () => {
  it('formats minutes and seconds', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(64.9)).toBe('1:04');
    expect(formatTime(134)).toBe('2:14');
  });

  it('adds hours past one hour', () => {
    expect(formatTime(3725)).toBe('1:02:05');
  });

  it('treats non-finite input as zero', () => {
    expect(formatTime(Number.NaN)).toBe('0:00');
    expect(formatTime(Number.POSITIVE_INFINITY)).toBe('0:00');
  });
});

describe('frameOf', () => {
  it('names the frame on screen at a boundary', () => {
    expect(frameOf(1, 30)).toBe(30);
    expect(frameOf(0.1, 30)).toBe(3);
    expect(frameOf(1 / 30 - 1e-9, 30)).toBe(1);
  });
});

describe('steppedTime', () => {
  it('lands on frame centres so repeated steps visit every frame once', () => {
    const frames: number[] = [];
    let t = 0;
    for (let i = 0; i < 10; i++) {
      t = steppedTime(t, 1, 10, 30);
      frames.push(frameOf(t, 30));
    }
    expect(frames).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('clamps to the media range', () => {
    expect(steppedTime(0, -1, 10, 30)).toBe(0);
    expect(steppedTime(10, 5, 10, 30)).toBe(10);
  });
});

describe('sectionAt', () => {
  const sections = sortSections([
    { start: 47, title: 'Create agent' },
    { start: 18, title: 'Sign in' },
  ]);

  it('sorts sections by start', () => {
    expect(sections.map((s) => s.title)).toEqual(['Sign in', 'Create agent']);
  });

  it('returns the section the time is in', () => {
    expect(sectionAt(sections, 20)?.title).toBe('Sign in');
    expect(sectionAt(sections, 47)?.title).toBe('Create agent');
  });

  it('returns nothing in the untitled lead-in', () => {
    expect(sectionAt(sections, 5)).toBeUndefined();
  });
});

describe('markersAt', () => {
  const a = { content: 'a', time: 10 };
  const b = { content: 'b', time: 10 };
  const c = { content: 'c', time: 11 };
  const silent = { time: 10.5 };

  it('shows a marker from just before its frame until two seconds after', () => {
    expect(markersAt([c], 11 - 0.5 / 30, 30)).toEqual([c]);
    expect(markersAt([c], 12.9, 30)).toEqual([c]);
    expect(markersAt([c], 13, 30)).toEqual([]);
    expect(markersAt([c], 10.9, 30)).toEqual([]);
  });

  it('shows every marker on the latest frame together', () => {
    expect(markersAt([a, b], 10.5, 30)).toEqual([a, b]);
    expect(markersAt([c, a, b], 11.5, 30)).toEqual([c]);
  });

  it('ignores markers without content', () => {
    expect(markersAt([silent], 10.6, 30)).toEqual([]);
  });
});

describe('mergeSegments', () => {
  const sections = (starts: number[]) => starts.map((start) => ({ start, title: String(start) }));

  it('cuts one segment per section and covers the lead-in', () => {
    const result = mergeSegments(sections([10, 50]), 100, 1000);
    expect(result.segments).toEqual([
      { end: 10, start: 0 },
      { end: 50, start: 10 },
      { end: 100, start: 50 },
    ]);
    expect(result.hairlines).toEqual([]);
  });

  it('merges a narrow section into the previous segment and keeps a hairline', () => {
    const result = mergeSegments(sections([0, 40, 41, 80]), 100, 1000);
    expect(result.segments).toEqual([
      { end: 41, start: 0 },
      { end: 80, start: 41 },
      { end: 100, start: 80 },
    ]);
    expect(result.hairlines).toEqual([40]);
  });

  it('chains consecutive narrow sections', () => {
    const result = mergeSegments(sections([0, 50, 50.5, 51, 51.5]), 100, 1000);
    expect(result.segments).toEqual([
      { end: 51.5, start: 0 },
      { end: 100, start: 51.5 },
    ]);
    expect(result.hairlines).toEqual([50, 50.5, 51]);
  });

  it('merges a narrow first segment forward', () => {
    const result = mergeSegments(sections([0, 0.5, 60]), 100, 1000);
    expect(result.segments).toEqual([
      { end: 60, start: 0 },
      { end: 100, start: 60 },
    ]);
    expect(result.hairlines).toEqual([0.5]);
  });

  it('keeps more segments on a wider track', () => {
    const narrow = mergeSegments(sections([0, 40, 41]), 100, 600);
    const wide = mergeSegments(sections([0, 40, 41]), 100, 1500);
    expect(narrow.segments).toHaveLength(2);
    expect(wide.segments).toHaveLength(3);
  });

  it('returns one whole segment without sections', () => {
    expect(mergeSegments([], 100, 1000).segments).toEqual([{ end: 100, start: 0 }]);
  });

  it('returns nothing before the duration is known', () => {
    expect(mergeSegments(sections([0, 10]), 0, 1000)).toEqual({ hairlines: [], segments: [] });
  });
});
