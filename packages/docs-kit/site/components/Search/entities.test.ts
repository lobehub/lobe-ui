import { decodeEntities } from './entities';

it('decodes the common named entities', () => {
  expect(decodeEntities('a &amp; b &lt; c &gt; d &quot;e&quot; &apos;f&apos;')).toBe(
    'a & b < c > d "e" \'f\'',
  );
});

it('decodes numeric decimal and hexadecimal references', () => {
  expect(decodeEntities('&#39;quote&#39; and &#x27;quote&#x27;')).toBe("'quote' and 'quote'");
  expect(decodeEntities('caf&#233;')).toBe('café');
});

it('renders escaped angle-bracket markup as literal text, not an element', () => {
  expect(decodeEntities('&lt;img src=x&gt;')).toBe('<img src=x>');
  expect(
    decodeEntities('ReactElement&lt;unknown, string | JSXElementConstructor&lt;any&gt;&gt;'),
  ).toBe('ReactElement<unknown, string | JSXElementConstructor<any>>');
});

it('leaves unknown or malformed entities untouched', () => {
  expect(decodeEntities('100% &copy; &notreal; a &amp')).toBe('100% &copy; &notreal; a &amp');
  expect(decodeEntities('&#xZZ; &#99999999999;')).toBe('&#xZZ; &#99999999999;');
});

it('decodes a single pass only (does not re-decode produced entities)', () => {
  expect(decodeEntities('&amp;lt;')).toBe('&lt;');
});
