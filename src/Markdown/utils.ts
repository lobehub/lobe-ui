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
  let count2 = 0;
  let result = '';
  let inCodeBlock = false;
  let inInlineCode = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (text.slice(i, i + 3) === '```') {
      inCodeBlock = !inCodeBlock;
      result += '```';
      i += 2;
      continue;
    }
    if (char === '`') {
      inInlineCode = !inInlineCode;
      result += '`';
      continue;
    }

    if (char === '*' && !inInlineCode && !inCodeBlock) {
      count++;
      if (count === 2) {
        count2++;
      }
      if (count > 2) {
        result += char;
        continue;
      }
      if (count === 2 && count2 % 2 === 0) {
        const prevChar = i > 0 ? text[i - 2] : '';
        const isPrevCharSymbol = /[\p{P}\p{S}]/u.test(prevChar);

        result += i + 1 < text.length && text[i + 1] !== ' ' && isPrevCharSymbol ? '* ' : '*';
      } else {
        result += '*';
      }
    } else {
      result += char;
      count = 0;
    }
  }
  return result;
}

export const transformCitations = (
  rawContent: string,
  citationIds: string[] = ['1', '2', '3', '4', '5', '6', '7'],
) => {
  // 生成动态正则表达式模式
  const pattern = new RegExp(`[(${citationIds.join('|')})]`, 'g');

  return rawContent
    .replace(pattern, (match, id) => `[#${id}](citation-${id})`)
    .replaceAll('][', '] [');
};
