import ts from 'typescript';

export const renderType = (checker: ts.TypeChecker, type: ts.Type, location: ts.Node): string =>
  checker.typeToString(
    type,
    location,
    ts.TypeFormatFlags.NoTruncation |
      ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
      ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType,
  );
