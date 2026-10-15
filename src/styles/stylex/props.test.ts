import * as stylex from '@stylexjs/stylex';

import { styleProps } from './props';

const styles = stylex.create({
  dynamic: (color: string) => ({ color }),
  root: { color: 'red' },
});

describe('styleProps', () => {
  it('appends the consumer className', () => {
    expect(styleProps(styles.root, 'custom').className).toBe(
      `${stylex.props(styles.root).className} custom`,
    );
  });

  it('merges style with the consumer last', () => {
    const base = stylex.props(styles.dynamic('red')).style!;
    const [key] = Object.keys(base);

    expect(
      styleProps(styles.dynamic('red'), undefined, { [key]: 'blue', marginBlock: 1 }).style,
    ).toEqual({
      ...base,
      [key]: 'blue',
      marginBlock: 1,
    });
  });

  it('returns no style when neither side has one', () => {
    expect(styleProps(styles.root).style).toBeUndefined();
    expect(styleProps([]).style).toBeUndefined();
  });
});
