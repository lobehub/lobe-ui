import { getOptionSearchText } from '../helpers';

describe('getOptionSearchText', () => {
  test('uses the visible title when the label is a React node', () => {
    expect(
      getOptionSearchText({
        label: <span>Claude Code</span>,
        title: 'Claude Code',
        value: 'opaque-agent-id',
      }),
    ).toBe('Claude Code');
  });
});
