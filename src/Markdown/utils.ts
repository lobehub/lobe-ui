export function escapeDollarNumber(text: string): string {
  let escapedText = '';
  let inCodeBlock = false;
  let inSingleLineCodeBlock = false;
  let i = 0;
  while (i < text.length) {
    let char = text[i];
    if (char === '`') {
      let tickCount = 1;
      while (text[i + tickCount] === '`') {
        tickCount++;
      }
      if (tickCount === 3) {
        inCodeBlock = !inCodeBlock;
        escapedText += '```';
        i += tickCount;
        continue;
      } else if (tickCount === 1) {
        inSingleLineCodeBlock = !inSingleLineCodeBlock;
        escapedText += '`';
        i += tickCount;
        continue;
      }
    }
    if (
      !inCodeBlock &&
      !inSingleLineCodeBlock &&
      char === '$' &&
      i + 1 < text.length &&
      text[i + 1] >= '0' &&
      text[i + 1] <= '9'
    ) {
      char = '\\$';
    }
    escapedText += char;
    i++;
  }
  return escapedText;
}

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
