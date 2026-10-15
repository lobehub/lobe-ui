import { getDrawerMotionConfig } from '../constants';

describe('getDrawerMotionConfig', () => {
  test('parks the panel offscreen along the placement axis', () => {
    expect(getDrawerMotionConfig('right').initial).toEqual({ x: '100%' });
    expect(getDrawerMotionConfig('left').initial).toEqual({ x: '-100%' });
    expect(getDrawerMotionConfig('top').initial).toEqual({ y: '-100%' });
    expect(getDrawerMotionConfig('bottom').initial).toEqual({ y: '100%' });
  });

  test('rests at origin when nothing pushes it', () => {
    for (const placement of ['bottom', 'left', 'right', 'top'] as const) {
      expect(getDrawerMotionConfig(placement).animate).toEqual({ x: 0, y: 0 });
    }
  });

  test('pushes away from the anchored edge', () => {
    expect(getDrawerMotionConfig('right', 180).animate).toEqual({ x: -180, y: 0 });
    expect(getDrawerMotionConfig('left', 180).animate).toEqual({ x: 180, y: 0 });
    expect(getDrawerMotionConfig('top', 180).animate).toEqual({ x: 0, y: 180 });
    expect(getDrawerMotionConfig('bottom', 180).animate).toEqual({ x: 0, y: -180 });
  });

  test('carries the exit offset on the same axis as the entrance', () => {
    expect(getDrawerMotionConfig('right', 180).exit).toMatchObject({ x: '100%' });
    expect(getDrawerMotionConfig('bottom', 180).exit).toMatchObject({ y: '100%' });
  });
});
