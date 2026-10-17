import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tokens = [
  ['cssVar.stylex.ts', 'cssVar'],
  ['media.stylex.ts', 'media'],
] as const;

export const publishStylexTokens = (outDir: string) => {
  mkdirSync(outDir, { recursive: true });

  for (const [file, name] of tokens) {
    const source = readFileSync(
      path.resolve(import.meta.dirname, '../src/styles/stylex', file),
      'utf8',
    );
    if (!source.includes(`export const ${name} = stylex.defineConsts(`)) {
      throw new Error(`${file} must export ${name} via stylex.defineConsts`);
    }
    if (source.includes(`export { ${name} }`)) {
      throw new Error(`${file} re-exports a compiled token object`);
    }

    writeFileSync(path.join(outDir, file.replace(/\.ts$/, '.js')), source);
    writeFileSync(path.join(outDir, file), source);
  }
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  publishStylexTokens(path.resolve(import.meta.dirname, '../es/stylex'));
}
