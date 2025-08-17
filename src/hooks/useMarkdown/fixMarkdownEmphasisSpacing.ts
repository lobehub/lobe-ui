function splitInlineCode(text: string) {
  const segments = [];
  let currentPos = 0;

  // 匹配行内代码，支持多个反引号
  const inlineCodeRegex = /(`+)([^`]*?)\1/g;

  let match;
  while ((match = inlineCodeRegex.exec(text)) !== null) {
    // 添加代码前的普通文本
    if (match.index > currentPos) {
      segments.push({
        content: text.slice(currentPos, match.index),
        isCode: false,
      });
    }

    // 添加行内代码
    segments.push({
      content: match[0],
      isCode: true,
    });

    currentPos = match.index + match[0].length;
  }

  // 添加最后剩余的普通文本
  if (currentPos < text.length) {
    segments.push({
      content: text.slice(currentPos),
      isCode: false,
    });
  }

  return segments;
}

function applyEmphasisFixes(text: string) {
  let result = text;

  // Step 1: Remove trailing spaces inside emphasis markers
  const removeInternalSpaces = [
    // 处理 **bold** 格式（两个星号）- 只处理一个空格
    { pattern: /(\*\*)([^\n*]+?)( )(\*\*)/g, replacement: '$1$2$4' },
    // 处理 __bold__ 格式（两个下划线）- 只处理一个空格
    { pattern: /(__)([^\n_]+?)( )(__)/g, replacement: '$1$2$4' },
    // 处理 ~~strikethrough~~ 格式（删除线）- 只处理一个空格
    { pattern: /(~~)([^\n~]+?)( )(~~)/g, replacement: '$1$2$4' },
    // 处理单个 * 格式 - 只处理一个空格，使用更精确的边界匹配
    { pattern: /(^|[^\w*])(\*(?!\*))([^\n*]+?)( )(\*(?!\*))/g, replacement: '$1$2$3$5' },
    // 处理单个 _ 格式 - 只处理一个空格，使用更精确的边界匹配
    { pattern: /(^|\W)(_(?!_))([^\n_]+?)( )(_(?!_))/g, replacement: '$1$2$3$5' },
  ];

  result = removeInternalSpaces.reduce((text, { pattern, replacement }) => {
    return text.replace(pattern, replacement);
  }, result);

  // Step 2: Add space after closing emphasis markers when followed by symbols/punctuation/Chinese characters
  // Define emphasis patterns
  const emphasisPatterns = [
    // ** (bold)
    { markerChar: '*', pattern: /(\*\*)([^\n*]*?)(\*\*)(\S)/g },
    // __ (bold)
    { markerChar: '_', pattern: /(__)([^\n_]*?)(__)(\S)/g },
    // * (italic) - need to avoid matching **
    { markerChar: '*', pattern: /(\*(?!\*))([^\n*]*?)(\*(?!\*))(\S)/g },
    // _ (italic) - need to avoid matching __
    { markerChar: '_', pattern: /(_(?!_))([^\n_]*?)(_(?!_))(\S)/g },
    // ~~ (strikethrough)
    { markerChar: '~', pattern: /(~~)([^\n~]*?)(~~)(\S)/g },
  ];

  // Apply space after closing markers for each emphasis type
  for (const { pattern } of emphasisPatterns) {
    result = result.replaceAll(pattern, (match, start, content, end, nextChar) => {
      // Check if the content ends with a symbol/punctuation (like ：, :, etc.)
      const lastChar = content.slice(-1);
      const isSymbolOrPunctuation =
        /[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~、。《》【】！（），：；？｛｜｝-]/.test(lastChar);

      // If content ends with symbol/punctuation and next character is not whitespace, add space
      if (isSymbolOrPunctuation && nextChar && !/\s/.test(nextChar)) {
        return start + content + end + ' ' + nextChar;
      }
      return match;
    });
  }

  // Step 3: Add space before opening emphasis markers when preceded by non-whitespace and first char is symbol/punctuation
  const beforeEmphasisPatterns = [
    // ** (bold)
    { markerChar: '*', pattern: /(\S)(\*\*)([^\n*]*?)(\*\*)/g },
    // __ (bold)
    { markerChar: '_', pattern: /(\S)(__)([^\n_]*?)(__)/g },
    // * (italic) - need to avoid matching **
    { markerChar: '*', pattern: /(\S)(\*(?!\*))([^\n*]*?)(\*(?!\*))/g },
    // _ (italic) - need to avoid matching __
    { markerChar: '_', pattern: /(\S)(_(?!_))([^\n_]*?)(_(?!_))/g },
    // ~~ (strikethrough)
    { markerChar: '~', pattern: /(\S)(~~)([^\n~]*?)(~~)/g },
  ];

  // Apply space before opening markers for each emphasis type
  for (const { pattern } of beforeEmphasisPatterns) {
    result = result.replaceAll(pattern, (match, prevChar, start, content, end) => {
      // Check if the content starts with a symbol/punctuation (like ：, :, ", (, etc.)
      const firstChar = content.charAt(0);
      const isSymbolOrPunctuation =
        /[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~、。《》【】！（），：；？｛｜｝-]/.test(firstChar);

      // If previous character is not whitespace and content starts with symbol/punctuation, add space before
      if (prevChar && !/\s/.test(prevChar) && isSymbolOrPunctuation) {
        return prevChar + ' ' + start + content + end;
      }
      return match;
    });
  }

  // Step 4: Re-run step 2 after step 3 to handle cases where both before and after spaces are needed
  for (const { pattern } of emphasisPatterns) {
    result = result.replaceAll(pattern, (match, start, content, end, nextChar) => {
      // Check if the content ends with a symbol/punctuation (like ：, :, etc.)
      const lastChar = content.slice(-1);
      const isSymbolOrPunctuation =
        /[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~、。《》【】！（），：；？｛｜｝-]/.test(lastChar);

      // If content ends with symbol/punctuation and next character is not whitespace, add space
      if (isSymbolOrPunctuation && nextChar && !/\s/.test(nextChar)) {
        return start + content + end + ' ' + nextChar;
      }
      return match;
    });
  }

  return result;
}

function splitMarkdownWithAllCodeTypes(text: string) {
  const segments = [];
  const lines = text.split('\n');
  let currentSegment = '';
  let isInCodeBlock = false;
  let codeBlockType = null; // 'fenced' | 'indented'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 检查围栏代码块的开始/结束
    const fencedCodeMatch = line.match(/^(\s*)(```|~~~)/);

    if (fencedCodeMatch && !isInCodeBlock) {
      // 开始围栏代码块
      if (currentSegment) {
        segments.push({ content: currentSegment, isCode: false });
        currentSegment = '';
      }
      isInCodeBlock = true;
      codeBlockType = 'fenced';
      currentSegment = line + (i < lines.length - 1 ? '\n' : '');
    } else if (fencedCodeMatch && isInCodeBlock && codeBlockType === 'fenced') {
      // 结束围栏代码块
      currentSegment += line + (i < lines.length - 1 ? '\n' : '');
      segments.push({ content: currentSegment, isCode: true });
      currentSegment = '';
      isInCodeBlock = false;
      codeBlockType = null;
    } else if (isInCodeBlock) {
      // 在代码块内部
      currentSegment += line + (i < lines.length - 1 ? '\n' : '');
    } else {
      // 普通行，但需要检查行内代码
      currentSegment += line + (i < lines.length - 1 ? '\n' : '');
    }
  }

  // 处理最后的片段
  if (currentSegment) {
    segments.push({
      content: currentSegment,
      isCode: isInCodeBlock,
    });
  }

  // 进一步处理行内代码
  return segments.flatMap((segment) => {
    if (segment.isCode) {
      return [segment];
    }
    return splitInlineCode(segment.content);
  });
}

export function fixMarkdownEmphasisSpacing(text: string) {
  // 更完善的代码块识别，包括缩进代码块
  const segments = splitMarkdownWithAllCodeTypes(text);

  return segments
    .map((segment) => {
      if (segment.isCode) {
        return segment.content;
      }
      return applyEmphasisFixes(segment.content);
    })
    .join('');
}
