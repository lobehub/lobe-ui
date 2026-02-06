import { renderToString } from 'katex';

// ============================================================================
// Utility Classes
// ============================================================================

/**
 * PlaceholderManager - Manages temporary replacement and restoration of protected content
 * Used to protect code blocks and LaTeX expressions during preprocessing
 */
class PlaceholderManager {
  private placeholders: string[] = [];
  private prefix: string;

  constructor(prefix = 'PROTECTED') {
    this.prefix = prefix;
  }

  add(content: string): string {
    const index = this.placeholders.length;
    this.placeholders.push(content);
    return `<<${this.prefix}_${index}>>`;
  }

  restore(text: string): string {
    return text.replaceAll(new RegExp(`<<${this.prefix}_(\\d+)>>`, 'g'), (_, index) => {
      return this.placeholders[Number.parseInt(index)] || '';
    });
  }

  clear(): void {
    this.placeholders = [];
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

// Helper: replace unescaped pipes with \vert within a LaTeX math fragment
const replaceUnescapedPipes = (formula: string): string =>
  // Use \vert{} so the control sequence terminates before the next token
  formula.replaceAll(/(?<!\\)\|/g, '\\vert{}');

/**
 * Converts LaTeX bracket delimiters to dollar sign delimiters.
 * Converts \[...\] to $$...$$ and \(...\) to $...$
 * Preserves code blocks during the conversion.
 *
 * @param text The input string containing LaTeX expressions
 * @returns The string with LaTeX bracket delimiters converted to dollar sign delimiters
 */
export function convertLatexDelimiters(text: string): string {
  const pattern = /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
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

/**
 * Escapes mhchem commands in LaTeX expressions to ensure proper rendering.
 *
 * @param text The input string containing LaTeX expressions with mhchem commands
 * @returns The string with escaped mhchem commands
 */
export function escapeMhchemCommands(text: string) {
  return text.replaceAll('$\\ce{', '$\\\\ce{').replaceAll('$\\pu{', '$\\\\pu{');
}

/**
 * Escapes pipe characters within LaTeX expressions to prevent them from being interpreted
 * as table column separators in markdown tables.
 *
 * @param text The input string containing LaTeX expressions
 * @returns The string with pipe characters escaped in LaTeX expressions
 */
export function escapeLatexPipes(text: string): string {
  // Replace unescaped '|' inside LaTeX math spans with '\vert' so that
  // remark-gfm table parsing won't treat them as column separators.
  // Leave code blocks/inline code untouched.
  // Also ignore escaped dollars (\$) which are currency symbols

  // Process code blocks first to protect them
  const codeBlocks: string[] = [];
  let content = text.replaceAll(/(```[\s\S]*?```|`[^\n`]*`)/g, (match) => {
    codeBlocks.push(match);
    return `<<CODE_${codeBlocks.length - 1}>>`;
  });

  // For display math, allow multiline
  content = content.replaceAll(/\$\$([\s\S]*?)\$\$/g, (match, display) => {
    return `$$${replaceUnescapedPipes(display)}$$`;
  });

  // For inline math, use non-greedy match that DOES NOT cross newlines
  // This prevents issues in tables where $ might appear in different cells
  content = content.replaceAll(/(?<!\\)\$(?!\$)([^\n$]*)(?<!\\)\$(?!\$)/g, (match, inline) => {
    return `$${replaceUnescapedPipes(inline)}$`;
  });

  // Restore code blocks
  content = content.replaceAll(/<<CODE_(\d+)>>/g, (_, index) => {
    return codeBlocks[Number.parseInt(index)];
  });

  return content;
}

/**
 * Escapes underscores within \text{...} commands in LaTeX expressions
 * that are not already escaped.
 * For example, \text{node_domain} becomes \text{node\_domain},
 * but \text{node\_domain} remains \text{node\_domain}.
 *
 * @param text The input string potentially containing LaTeX expressions
 * @returns The string with unescaped underscores escaped within \text{...} commands
 */
export function escapeTextUnderscores(text: string): string {
  return text.replaceAll(/\\text\{([^}]*)\}/g, (match, textContent: string) => {
    // textContent is the content within the braces, e.g., "node_domain" or "already\_escaped"
    // Replace underscores '_' with '\_' only if they are NOT preceded by a backslash '\'.
    // The (?<!\\) is a negative lookbehind assertion that ensures the character before '_' is not a '\'.
    const escapedTextContent = textContent.replaceAll(/(?<!\\)_/g, '\\_');
    return `\\text{${escapedTextContent}}`;
  });
}

/**
 * Escapes dollar signs that appear to be currency symbols to prevent them from being
 * interpreted as LaTeX math delimiters.
 *
 * This function identifies currency patterns such as:
 * - $20, $100, $1,000
 * - $20-50, $100+
 * - Patterns within markdown tables
 *
 * @param text The input string containing potential currency symbols
 * @returns The string with currency dollar signs escaped
 */
export function escapeCurrencyDollars(text: string): string {
  // Protect code blocks and existing LaTeX expressions from processing
  const manager = new PlaceholderManager('PROTECTED');

  let content = text.replaceAll(
    // Match patterns to protect (in order):
    // 1. Code blocks: ```...```
    // 2. Inline code: `...`
    // 3. Display math: $$...$$
    // 4. Inline math with LaTeX commands: $...\...$ (must contain backslash to distinguish from currency)
    // 5. Simple number formulas: $1$, $10$, $100$ (pure digits in math mode)
    // 6. Number lists in math mode: $1,-1,0$ or $1,2,3$ (comma-separated numbers, possibly negative)
    // 7. LaTeX bracket notation: \[...\]
    // 8. LaTeX parenthesis notation: \(...\)
    /(```[\s\S]*?```|`[^\n`]*`|\$\$[\s\S]*?\$\$|(?<!\\)\$(?!\$)(?=[\s\S]*?\\)[\s\S]*?(?<!\\)\$(?!\$)|\$\d+\$|\$-?\d+(?:,-?\d+)+\$|\\\[[\s\S]*?\\\]|\\\(.*?\\\))/g,
    (match) => manager.add(match),
  );

  // Escape dollar signs that are clearly currency:
  // - $ followed by a digit
  // - Not preceded by another $ (to avoid breaking $$)
  // - Not followed immediately by another $ (to avoid breaking $1$ LaTeX)
  // - Followed by number patterns with optional commas, decimals, ranges, or plus signs
  // Match patterns like: $20, $1,000, $19.99, $20-50, $300+, $1,000-2,000+
  // But NOT: $1$, $2$ (these are LaTeX formulas)
  // In the replacement: \\ = backslash, $$ = literal $, $1 = capture group 1
  content = content.replaceAll(
    /(?<!\$)\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:-\d{1,3}(?:,\d{3})*(?:\.\d+)?)?\+?)(?!\$)/g,
    '\\$$$1',
  );

  // Restore protected content
  content = manager.restore(content);

  return content;
}

// Old simple preprocessLaTeX has been replaced by the comprehensive version below
// The new preprocessLaTeX provides the same default behavior with optional advanced featuresgit

/**
 * Extracts the LaTeX formula after the last $$ delimiter if there's an odd number of $$ delimiters.
 *
 * @param text The input string containing LaTeX formulas
 * @returns The content after the last $$ if there's an odd number of $$, otherwise an empty string
 */
const extractIncompleteFormula = (text: string) => {
  // Count the number of $$ delimiters
  const dollarsCount = (text.match(/\$\$/g) || []).length;

  // If odd number of $$ delimiters, extract content after the last $$
  if (dollarsCount % 2 === 1) {
    const match = text.match(/\$\$([\s\S]*)$/);
    return match ? match[1] : '';
  }

  // If even number of $$ delimiters, return empty string
  return '';
};

/**
 * Checks if the last LaTeX formula in the text is renderable.
 * Only validates the formula after the last $$ if there's an odd number of $$.
 *
 * @param text The input string containing LaTeX formulas
 * @returns True if the last formula is renderable or if there's no incomplete formula
 */
export const isLastFormulaRenderable = (text: string) => {
  const formula = extractIncompleteFormula(text);

  // If no incomplete formula, return true
  if (!formula) return true;

  // Try to render the last formula
  try {
    renderToString(formula, {
      displayMode: true,
      throwOnError: true,
    });
    return true;
  } catch (error) {
    console.error(`LaTeX formula rendering error: ${error}`);
    return false;
  }
};

// ============================================================================
// Advanced Preprocessing Functions
// ============================================================================

/**
 * Fixes common LaTeX syntax errors automatically
 * - Balances unmatched braces
 * - Balances \left and \right delimiters
 *
 * @param text The input string containing LaTeX expressions
 * @returns The string with fixed LaTeX expressions
 */
export function fixCommonLaTeXErrors(text: string): string {
  return text.replaceAll(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g, (match) => {
    let fixed = match;

    // Fix unbalanced braces
    const openBraces = (fixed.match(/(?<!\\)\{/g) || []).length;
    const closeBraces = (fixed.match(/(?<!\\)\}/g) || []).length;
    if (openBraces > closeBraces) {
      const diff = openBraces - closeBraces;
      const closingBraces = '}'.repeat(diff);
      // Insert before the closing delimiter
      fixed = fixed.replace(/(\$\$?)$/, closingBraces + '$1');
    }

    // Fix unbalanced \left and \right
    const leftDelims = (fixed.match(/\\left[(.<[{|]/g) || []).length;
    const rightDelims = (fixed.match(/\\right[).>\]|}]/g) || []).length;
    if (leftDelims > rightDelims) {
      const diff = leftDelims - rightDelims;
      const rightDots = '\\right.'.repeat(diff);
      fixed = fixed.replace(/(\$\$?)$/, rightDots + '$1');
    }

    return fixed;
  });
}

/**
 * Normalizes whitespace in LaTeX expressions
 * - Removes extra spaces around $ delimiters
 * - Normalizes multiple spaces to single space inside formulas
 *
 * @param text The input string containing LaTeX expressions
 * @returns The string with normalized whitespace
 */
export function normalizeLatexSpacing(text: string): string {
  let result = text;

  // Remove spaces inside $ delimiters (at the edges)
  result = result.replaceAll(/\$\s+/g, '$');
  result = result.replaceAll(/\s+\$/g, '$');
  result = result.replaceAll(/\$\$\s+/g, '$$');
  result = result.replaceAll(/\s+\$\$/g, '$$');

  // Normalize multiple spaces inside formulas to single space
  result = result.replaceAll(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g, (match) => {
    return match.replaceAll(/\s{2,}/g, ' ');
  });

  return result;
}

/**
 * Validates all LaTeX expressions in the text
 * Returns detailed information about validation results
 *
 * @param text The input string containing LaTeX expressions
 * @returns Validation results with errors if any
 */
export function validateLatexExpressions(text: string): {
  errors: Array<{
    formula: string;
    message: string;
    position: number;
    type: 'display' | 'inline';
  }>;
  totalExpressions: number;
  valid: boolean;
} {
  const errors: Array<{
    formula: string;
    message: string;
    position: number;
    type: 'display' | 'inline';
  }> = [];

  let totalExpressions = 0;
  const pattern = /\$\$([\s\S]*?)\$\$|(?<!\\)\$(?!\$)([\s\S]*?)(?<!\\)\$(?!\$)/g;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    totalExpressions++;
    const formula = match[1] || match[2];
    const isDisplay = match[0].startsWith('$$');

    try {
      renderToString(formula, {
        displayMode: isDisplay,
        strict: 'warn',
        throwOnError: true,
        trust: false,
      });
    } catch (error) {
      errors.push({
        formula: formula.slice(0, 50) + (formula.length > 50 ? '...' : ''),
        message: error instanceof Error ? error.message : String(error),
        position: match.index,
        type: isDisplay ? 'display' : 'inline',
      });
    }
  }

  return {
    errors,
    totalExpressions,
    valid: errors.length === 0,
  };
}

/**
 * Handles CJK (Chinese, Japanese, Korean) characters mixed with LaTeX
 * Optionally adds spaces between CJK characters and LaTeX expressions for better rendering
 *
 * @param text The input string
 * @param addSpaces Whether to add spaces between CJK and LaTeX (default: false)
 * @returns The processed string
 */
export function handleCJKWithLatex(text: string, addSpaces = false): string {
  if (!addSpaces) return text;

  let result = text;

  // Add space between CJK character and opening $
  result = result.replaceAll(/([\u3040-\u30FF\u4E00-\u9FA5])(\$)/g, '$1 $2');

  // Add space between closing $ and CJK character
  result = result.replaceAll(/(\$)([\u3040-\u30FF\u4E00-\u9FA5])/g, '$1 $2');

  return result;
}

// ============================================================================
// Advanced Preprocessing Options
// ============================================================================

export interface AdvancedPreprocessOptions {
  /** Add spaces between CJK and LaTeX (default: false, requires handleCJK: true) */
  addCJKSpaces?: boolean;
  /** Convert bracket notation \[...\] to $$...$$ (default: true) */
  convertBrackets?: boolean;
  /** Enable currency escaping (default: true) */
  escapeCurrency?: boolean;
  /** Escape mhchem commands (default: true) */
  escapeMhchem?: boolean;
  /** Escape pipe symbols in LaTeX (default: true) */
  escapePipes?: boolean;
  /** Escape underscores in \text{} (default: true) */
  escapeUnderscores?: boolean;
  /** Automatically fix common LaTeX errors (default: false) */
  fixErrors?: boolean;
  /** Handle CJK characters (default: false) */
  handleCJK?: boolean;
  /** Normalize whitespace (default: false) */
  normalizeSpacing?: boolean;
  /** Throw error on validation failure (default: false, requires validate: true) */
  throwOnValidationError?: boolean;
  /** Validate LaTeX syntax (default: false) */
  validate?: boolean;
}

/**
 * Comprehensive LaTeX preprocessing with configurable options
 *
 * This is the main preprocessing function that handles:
 * - Currency symbol escaping (e.g., $20 → \$20)
 * - LaTeX delimiter conversion (\[...\] → $$...$$)
 * - Special character escaping (pipes, underscores, mhchem)
 * - Optional error fixing and validation
 * - Optional CJK character handling
 *
 * @param text The input string containing LaTeX and Markdown
 * @param options Configuration options for fine-grained control
 * @returns The preprocessed string
 *
 * @example
 * ```ts
 * // Default behavior (same as old preprocessLaTeX)
 * preprocessLaTeX('向量$90^\\circ$，非 $0^\\circ$ 和 $180^\\circ$')
 *
 * // With custom options
 * preprocessLaTeX(text, {
 *   fixErrors: true,
 *   validate: true,
 *   handleCJK: true
 * })
 * ```
 */
export function preprocessLaTeX(text: string, options: AdvancedPreprocessOptions = {}): string {
  const {
    addCJKSpaces = false,
    convertBrackets = true,
    escapeCurrency = true,
    escapeMhchem = true,
    escapePipes = true,
    escapeUnderscores = true,
    fixErrors = false,
    handleCJK = false,
    normalizeSpacing = false,
    throwOnValidationError = false,
    validate = false,
  } = options;

  let content = text;

  // Phase 1: Currency escaping (if enabled)
  if (escapeCurrency) {
    content = escapeCurrencyDollars(content);
  }

  // Phase 2: Bracket conversion (if enabled)
  if (convertBrackets) {
    content = convertLatexDelimiters(content);
  }

  // Phase 3: LaTeX-specific escaping
  if (escapeMhchem) {
    content = escapeMhchemCommands(content);
  }

  if (escapePipes) {
    content = escapeLatexPipes(content);
  }

  if (escapeUnderscores) {
    content = escapeTextUnderscores(content);
  }

  // Phase 4: Error fixing (if enabled)
  if (fixErrors) {
    content = fixCommonLaTeXErrors(content);
  }

  // Phase 5: Whitespace normalization (if enabled)
  if (normalizeSpacing) {
    content = normalizeLatexSpacing(content);
  }

  // Phase 6: CJK handling (if enabled)
  if (handleCJK) {
    content = handleCJKWithLatex(content, addCJKSpaces);
  }

  // Phase 7: Validation (if enabled)
  if (validate) {
    const validation = validateLatexExpressions(content);
    if (!validation.valid) {
      const errorMessage = `LaTeX validation failed (${validation.errors.length}/${validation.totalExpressions} expressions have errors):\n${validation.errors.map((e) => `  - [${e.type}] at position ${e.position}: ${e.message}\n    Formula: ${e.formula}`).join('\n')}`;

      if (throwOnValidationError) {
        throw new Error(errorMessage);
      } else {
        console.warn(errorMessage);
      }
    }
  }

  return content;
}

/**
 * Strict preprocessing mode - enables all safety features and validations
 * Use this when you want maximum correctness and are willing to accept the performance cost
 *
 * @param text The input string
 * @returns The preprocessed string with all features enabled
 *
 * @example
 * ```ts
 * const processed = preprocessLaTeXStrict(userInput)
 * // Enables: error fixing, validation, CJK handling, space normalization
 * ```
 */
export function preprocessLaTeXStrict(text: string): string {
  return preprocessLaTeX(text, {
    addCJKSpaces: false, // Usually don't want extra spaces
    convertBrackets: true,
    escapeCurrency: true,
    escapeMhchem: true,
    escapePipes: true,
    escapeUnderscores: true,
    fixErrors: true,
    handleCJK: true,
    normalizeSpacing: true,
    throwOnValidationError: false, // Warn but don't throw
    validate: true,
  });
}

/**
 * Minimal preprocessing mode - only essential operations
 * Use this for better performance when you control the input
 *
 * @param text The input string
 * @returns The preprocessed string with minimal processing
 *
 * @example
 * ```ts
 * const processed = preprocessLaTeXMinimal(trustedInput)
 * // Only escapes currency and converts brackets
 * ```
 */
export function preprocessLaTeXMinimal(text: string): string {
  return preprocessLaTeX(text, {
    convertBrackets: true,
    escapeCurrency: true,
    escapeMhchem: false,
    escapePipes: false,
    escapeUnderscores: false,
    fixErrors: false,
    handleCJK: false,
    normalizeSpacing: false,
    validate: false,
  });
}
