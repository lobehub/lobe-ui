import { dirname, resolve } from 'node:path';

import ts from 'typescript';

import type { ApiRequest } from '../../types/api';

export interface ApiProgramContext {
  checker: ts.TypeChecker;
  configPath: string;
  generation: number;
  options: ts.CompilerOptions;
  program: ts.Program;
  root: string;
}

const formatDiagnostics = (diagnostics: readonly ts.Diagnostic[]): string => {
  const host: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: (file) => file,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => '\n',
  };
  return ts.formatDiagnostics(diagnostics, host).trim();
};

export const resolveProgramConfigPath = (
  request: Pick<ApiRequest, 'documentPath' | 'tsconfigPath'>,
): string => {
  if (request.tsconfigPath) return resolve(request.tsconfigPath);
  const discovered = ts.findConfigFile(dirname(resolve(request.documentPath)), ts.sys.fileExists);
  if (!discovered) {
    throw new Error(`No tsconfig.json found for ${request.documentPath}`);
  }
  return resolve(discovered);
};

export const createProgram = (
  request: Pick<ApiRequest, 'documentPath' | 'tsconfigPath'>,
  generation = 0,
): ApiProgramContext => {
  const configPath = resolveProgramConfigPath(request);
  const read = ts.readConfigFile(configPath, ts.sys.readFile);
  if (read.error)
    throw new Error(`Invalid TypeScript config ${configPath}:\n${formatDiagnostics([read.error])}`);

  const parsed = ts.parseJsonConfigFileContent(
    read.config,
    ts.sys,
    dirname(configPath),
    undefined,
    configPath,
  );
  if (parsed.errors.length > 0) {
    throw new Error(
      `Invalid TypeScript config ${configPath}:\n${formatDiagnostics(parsed.errors)}`,
    );
  }

  const program = ts.createProgram({ options: parsed.options, rootNames: parsed.fileNames });
  return {
    checker: program.getTypeChecker(),
    configPath,
    generation,
    options: parsed.options,
    program,
    root: dirname(configPath),
  };
};

export class ApiProgramCache {
  #context: ApiProgramContext | undefined;
  #generation = 0;
  readonly #request: Pick<ApiRequest, 'documentPath' | 'tsconfigPath'>;

  constructor(request: Pick<ApiRequest, 'documentPath' | 'tsconfigPath'>) {
    this.#request = request;
  }

  get generation(): number {
    return this.#generation;
  }

  get(): ApiProgramContext {
    return (this.#context ??= createProgram(this.#request, this.#generation));
  }

  invalidate(): void {
    this.#context = undefined;
    this.#generation += 1;
  }
}
