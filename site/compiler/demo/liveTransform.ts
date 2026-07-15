import ts from 'typescript';

export interface LiveDiagnostic {
  column?: number;
  line?: number;
  message: string;
}

export type LiveTransformResult =
  { code: string; ok: true } | { diagnostics: LiveDiagnostic[]; ok: false };

export interface LiveSourceParts {
  editableSource: string;
  immutableImports: string[];
  immutableSource: string;
}

export interface LiveTransformOptions {
  diagnosticLineOffset?: number;
}

interface SourceFileWithParseDiagnostics extends ts.SourceFile {
  parseDiagnostics: readonly ts.DiagnosticWithLocation[];
}

interface TextEdit {
  end: number;
  replacement: string;
  start: number;
}

const immutableImportPrefix = 'lobe-docs-import:';

const createSourceFile = (source: string): ts.SourceFile =>
  ts.createSourceFile('demo.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

const importSignature = (declaration: ts.ImportDeclaration): string => {
  const clause = declaration.importClause;
  const namedBindings = clause?.namedBindings;
  const attributes = declaration.attributes?.elements.map(({ name, value }) => ({
    name: name.text,
    value: ts.isStringLiteralLike(value) ? value.text : value.getText(),
  }));
  const signature = {
    attributes,
    clause: clause
      ? {
          default: clause.name?.text,
          named: namedBindings
            ? ts.isNamespaceImport(namedBindings)
              ? { local: namedBindings.name.text, type: 'namespace' }
              : {
                  elements: namedBindings.elements.map((element) => ({
                    imported: element.propertyName?.text ?? element.name.text,
                    local: element.name.text,
                    typeOnly: element.isTypeOnly,
                  })),
                  type: 'named',
                }
            : undefined,
          typeOnly: clause.isTypeOnly,
        }
      : null,
    source: ts.isStringLiteralLike(declaration.moduleSpecifier)
      ? declaration.moduleSpecifier.text
      : declaration.moduleSpecifier.getText(),
  };
  return `${immutableImportPrefix}${JSON.stringify(signature)}`;
};

const normalizeImmutableImport = (source: string): string => {
  if (source.startsWith(immutableImportPrefix)) return source;
  const sourceFile = createSourceFile(source);
  const declaration = sourceFile.statements.find(ts.isImportDeclaration);
  return declaration ? importSignature(declaration) : source.trim();
};

const locationForPosition = (
  sourceFile: ts.SourceFile,
  position: number,
): Pick<LiveDiagnostic, 'column' | 'line'> => {
  const location = sourceFile.getLineAndCharacterOfPosition(position);
  return { column: location.character + 1, line: location.line + 1 };
};

const syntaxDiagnostics = (sourceFile: ts.SourceFile): LiveDiagnostic[] =>
  (sourceFile as SourceFileWithParseDiagnostics).parseDiagnostics.map((diagnostic) => ({
    ...locationForPosition(sourceFile, diagnostic.start),
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
  }));

const hasModifier = (node: ts.Node, kind: ts.SyntaxKind): boolean =>
  ts.canHaveModifiers(node) && Boolean(ts.getModifiers(node)?.some((item) => item.kind === kind));

const withoutExportDefaultPrefix = (statement: ts.Statement, sourceFile: ts.SourceFile): string =>
  statement
    .getText(sourceFile)
    .replace(/^export\s+default\s+/, '')
    .trim();

const removeStatementEdit = (statement: ts.Statement, source: string): TextEdit => {
  let end = statement.end;
  if (source[end] === '\r') end += 1;
  if (source[end] === '\n') end += 1;
  return { end, replacement: '', start: statement.getStart() };
};

const stripExportModifierEdit = (
  statement: ts.Statement,
  sourceFile: ts.SourceFile,
): TextEdit | undefined => {
  if (!hasModifier(statement, ts.SyntaxKind.ExportKeyword)) return;
  const exportModifier = (
    ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined
  )?.find((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
  if (!exportModifier) return;

  let end = exportModifier.end;
  const source = sourceFile.text;
  while (end < source.length && /\s/.test(source[end]) && source[end] !== '\n') end += 1;
  return { end, replacement: '', start: exportModifier.getStart(sourceFile) };
};

const defaultExportReplacement = (
  statement: ts.Statement,
  sourceFile: ts.SourceFile,
): string | undefined => {
  if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
    return `const DemoEntry = ${statement.expression.getText(sourceFile)};`;
  }

  if (
    (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) &&
    hasModifier(statement, ts.SyntaxKind.DefaultKeyword)
  ) {
    if (statement.name) {
      return `${withoutExportDefaultPrefix(statement, sourceFile)}\nconst DemoEntry = ${statement.name.text};`;
    }
    return `const DemoEntry = ${withoutExportDefaultPrefix(statement, sourceFile)};`;
  }

  if (ts.isExportDeclaration(statement) && statement.exportClause) {
    if (!ts.isNamedExports(statement.exportClause) || statement.moduleSpecifier) return;
    const defaultSpecifier = statement.exportClause.elements.find(
      (element) => element.name.text === 'default',
    );
    if (!defaultSpecifier) return;
    return `const DemoEntry = ${defaultSpecifier.propertyName?.text ?? defaultSpecifier.name.text};`;
  }
};

const applyTextEdits = (source: string, edits: TextEdit[]): string => {
  let output = source;
  for (const edit of edits.toSorted((left, right) => right.start - left.start)) {
    output = `${output.slice(0, edit.start)}${edit.replacement}${output.slice(edit.end)}`;
  }
  return output.trim();
};

export function extractImmutableImports(source: string): string[] {
  const sourceFile = createSourceFile(source);
  return sourceFile.statements.filter(ts.isImportDeclaration).map(importSignature);
}

export function splitLiveSource(source: string): LiveSourceParts {
  const sourceFile = createSourceFile(source);
  const imports = sourceFile.statements.filter(ts.isImportDeclaration);
  const edits = imports.map((declaration) => removeStatementEdit(declaration, source));
  return {
    editableSource: applyTextEdits(source, edits),
    immutableImports: imports.map(importSignature),
    immutableSource: imports.map((declaration) => declaration.getText(sourceFile)).join('\n'),
  };
}

export function transformLiveSource(
  source: string,
  immutableImports: readonly string[],
  { diagnosticLineOffset = 0 }: LiveTransformOptions = {},
): LiveTransformResult {
  const mapDiagnostics = (diagnostics: LiveDiagnostic[]): LiveDiagnostic[] =>
    diagnostics.map((diagnostic) => ({
      ...diagnostic,
      line:
        diagnostic.line === undefined
          ? undefined
          : Math.max(1, diagnostic.line - diagnosticLineOffset),
    }));
  const sourceFile = createSourceFile(source);
  const parseDiagnostics = syntaxDiagnostics(sourceFile);
  if (parseDiagnostics.length > 0) {
    return { diagnostics: mapDiagnostics(parseDiagnostics), ok: false };
  }

  const imports = sourceFile.statements.filter(ts.isImportDeclaration);
  const actualImports = imports.map(importSignature);
  const expectedImports = immutableImports.map(normalizeImmutableImport);
  const mismatchIndex = Math.max(actualImports.length, expectedImports.length)
    ? Array.from({ length: Math.max(actualImports.length, expectedImports.length) }).findIndex(
        (_, index) => actualImports[index] !== expectedImports[index],
      )
    : -1;

  if (mismatchIndex >= 0) {
    const declaration = imports[mismatchIndex];
    return {
      diagnostics: mapDiagnostics([
        {
          ...(declaration
            ? locationForPosition(sourceFile, declaration.getStart(sourceFile))
            : { column: 1, line: 1 }),
          message: 'Imports are read-only. Restore the repository import declarations.',
        },
      ]),
      ok: false,
    };
  }

  const edits = imports.map((declaration) => removeStatementEdit(declaration, source));
  const defaultExports: ts.Statement[] = [];

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) continue;
    const replacement = defaultExportReplacement(statement, sourceFile);
    if (replacement) {
      defaultExports.push(statement);
      edits.push({ end: statement.end, replacement, start: statement.getStart(sourceFile) });
      continue;
    }

    if (ts.isExportDeclaration(statement)) {
      edits.push(removeStatementEdit(statement, source));
      continue;
    }

    const exportEdit = stripExportModifierEdit(statement, sourceFile);
    if (exportEdit) edits.push(exportEdit);
  }

  if (defaultExports.length !== 1) {
    const node = defaultExports[1] ?? sourceFile;
    return {
      diagnostics: mapDiagnostics([
        {
          ...locationForPosition(sourceFile, node.getStart(sourceFile)),
          message:
            defaultExports.length === 0
              ? 'A live demo must have one default component export.'
              : 'A live demo cannot have more than one default component export.',
        },
      ]),
      ok: false,
    };
  }

  const transformed = applyTextEdits(source, edits);
  return {
    code: `${transformed}\n\nrender(<DemoEntry />);`,
    ok: true,
  };
}
