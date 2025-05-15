import { renderToString } from 'katex';

export function escapeBrackets(text: string): string {
  const pattern = /(```[\S\s]*?```|`.*?`)|\\\[([\S\s]*?[^\\])\\]|\\\((.*?)\\\)/g;
  return text.replaceAll(
    pattern,
    (
      match: string,
      codeBlock: string | undefined,
      squareBracket: string | undefined,
      roundBracket: string | undefined,
    ): string => {
      if (codeBlock !== undefined) {
        return codeBlock;
      } else if (squareBracket !== undefined) {
        return `$$${squareBracket}$$`;
      } else if (roundBracket !== undefined) {
        return `$${roundBracket}$`;
      }
      return match;
    },
  );
}

export function escapeMhchem(text: string) {
  return text.replaceAll('$\\ce{', '$\\\\ce{').replaceAll('$\\pu{', '$\\\\pu{');
}

/**
 * Preprocesses LaTeX content by replacing delimiters and escaping certain characters.
 *
 * @param content The input string containing LaTeX expressions.
 * @returns The processed string with replaced delimiters and escaped characters.
 */
export function preprocessLaTeX(str: string): string {
  // Step 1: Protect code blocks
  const codeBlocks: string[] = [];
  let content = str.replaceAll(/(```[\S\s]*?```|`[^\n`]+`)/g, (match, code) => {
    codeBlocks.push(code);
    return `<<CODE_BLOCK_${codeBlocks.length - 1}>>`;
  });

  // Step 2: Protect existing LaTeX expressions
  const latexExpressions: string[] = [];
  content = content.replaceAll(/(\$\$[\S\s]*?\$\$|\\\[[\S\s]*?\\]|\\\(.*?\\\))/g, (match) => {
    latexExpressions.push(match);
    return `<<LATEX_${latexExpressions.length - 1}>>`;
  });

  // Step 3: Escape dollar signs that are likely currency indicators
  content = content.replaceAll(/\$(?=\d)/g, '\\$');

  // Step 4: Restore LaTeX expressions
  content = content.replaceAll(
    /<<LATEX_(\d+)>>/g,
    (_, index) => latexExpressions[Number.parseInt(index)],
  );

  // Step 5: Restore code blocks
  content = content.replaceAll(
    /<<CODE_BLOCK_(\d+)>>/g,
    (_, index) => codeBlocks[Number.parseInt(index)],
  );

  // Step 6: Apply additional escaping functions
  content = escapeBrackets(content);
  content = escapeMhchem(content);

  return content;
}

// 新增: 检测LaTeX公式是否可渲染
const extractFormulas = (text: string) => {
  // 计算$$的数量
  const dollarsCount = (text.match(/\$\$/g) || []).length;

  // 奇数个$$时，获取最后一个$$后的内容
  if (dollarsCount % 2 === 1) {
    const match = text.match(/\$\$([^]*)$/);
    return match ? match[1] : '';
  }

  // 偶数个$$时，返回空字符串
  return '';
};

// 只检查最后一个公式
export const areFormulasRenderable = (text: string) => {
  const formulas = extractFormulas(text);

  // 如果没有公式，返回true
  if (!formulas) return true;

  // 仅检查最后一个公式是否可渲染
  try {
    renderToString(formulas, {
      displayMode: true,
      throwOnError: true,
    });
    return true;
  } catch (error) {
    console.log(`LaTeX公式渲染错误: ${error}`);
    return false;
  }
};
