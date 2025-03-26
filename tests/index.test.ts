import { describe, expect, it } from 'vitest';

import { removeLineBreaksInAntArtifact } from '../src/Markdown/demos/customPlugins/utils';

describe('removeLineBreaksInAntArtifact', () => {
  it('should remove line breaks between <antArtifact> tags', () => {
    const input = `Some text
<antArtifact>
line1
line2
line3
</antArtifact>
more text`;

    const expected = `Some text
<antArtifact>line1line2line3</antArtifact>
more text`;

    expect(removeLineBreaksInAntArtifact(input)).toBe(expected);
  });

  it('should handle multiple antArtifact tags', () => {
    const input = `<antArtifact>
line1
line2
</antArtifact>
text
<antArtifact>
line3
line4
</antArtifact>`;

    const expected = `<antArtifact>line1line2</antArtifact>
text
<antArtifact>line3line4</antArtifact>`;

    expect(removeLineBreaksInAntArtifact(input)).toBe(expected);
  });

  it('should handle input without antArtifact tags', () => {
    const input = 'Just some\nregular text\nwith line breaks';
    expect(removeLineBreaksInAntArtifact(input)).toBe(input);
  });

  it('should handle empty input', () => {
    expect(removeLineBreaksInAntArtifact('')).toBe('');
  });

  it('should preserve spaces between words when removing line breaks', () => {
    const input = `<antArtifact>
Hello    World
Multiple    Spaces
</antArtifact>`;

    const expected = '<antArtifact>Hello    WorldMultiple    Spaces</antArtifact>';

    expect(removeLineBreaksInAntArtifact(input)).toBe(expected);
  });

  it.skip('should handle nested antArtifact tags', () => {
    const input = `<antArtifact>
outer1
<antArtifact>
inner1
inner2
</antArtifact>
outer2
</antArtifact>`;

    const expected =
      '<antArtifact>outer1<antArtifact>inner1inner2</antArtifact>outer2</antArtifact>';

    expect(removeLineBreaksInAntArtifact(input)).toBe(expected);
  });

  it('should handle antArtifact tags with attributes', () => {
    const input = `<antArtifact type="test" id="123">
line1
line2
</antArtifact>`;

    const expected = '<antArtifact type="test" id="123">line1line2</antArtifact>';

    expect(removeLineBreaksInAntArtifact(input)).toBe(expected);
  });
});
