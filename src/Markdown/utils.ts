export function escapeBrackets(text: string) {
  const pattern = /(```[\S\s]*?```|`.*?`)|\\\[([\S\s]*?[^\\])\\]|\\\((.*?)\\\)/g;
  return text.replaceAll(pattern, (match, codeBlock, squareBracket, roundBracket) => {
    if (codeBlock) {
      return codeBlock;
    } else if (squareBracket) {
      return `$$${squareBracket}$$`;
    } else if (roundBracket) {
      return `$${roundBracket}$`;
    }
    return match;
  });
}

export function escapeMhchem(text: string) {
  return text.replaceAll('$\\ce{', '$\\\\ce{').replaceAll('$\\pu{', '$\\\\pu{');
}

export function fixMarkdownBold(text: string): string {
  let count = 0;
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '*') {
      count++;
      if (count % 2 === 0) {
        const prevChar = i > 0 ? text[i - 1] : '';
        const isPrevCharAlphanumeric = /[a-zA-Z0-9]/.test(prevChar);

        if (i + 1 < text.length && text[i + 1] !== ' ' && !isPrevCharAlphanumeric) {
          result += '* ';
        } else {
          result += '*';
        }
      } else {
        result += '*';
      }
    } else {
      result += char;
    }
  }
  return result;
}
