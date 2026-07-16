import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { load } from 'cheerio';
import type { PagefindIndex } from 'pagefind';

export interface BuildPagefindOptions {
  inputDirectory: string;
  outputDirectory: string;
}

export type PagefindNodeApi = Pick<typeof import('pagefind'), 'close' | 'createIndex'>;
type LoadPagefind = () => Promise<PagefindNodeApi>;

export const PAGEFIND_ROOT_SELECTOR = '[data-pagefind-body]';

const addErrors = (diagnostics: string[], stage: string, errors: string[]): void => {
  for (const error of errors) diagnostics.push(`${stage}: ${error}`);
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const collectHtmlFiles = (directory: string): string[] => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.resolve(directory, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(absolute);
    return entry.isFile() && entry.name.endsWith('.html') ? [absolute] : [];
  });
};

interface IndexablePage {
  file: string;
  relative: string;
  route: string;
}

const findIndexablePages = (inputDirectory: string): IndexablePage[] =>
  collectHtmlFiles(inputDirectory)
    .flatMap((file) => {
      const html = readFileSync(file, 'utf8');
      if (load(html)('[data-pagefind-body]').length === 0) return [];
      const relative = path.relative(inputDirectory, file).replaceAll(path.sep, '/');
      const route =
        relative === 'index.html'
          ? '/'
          : relative.endsWith('/index.html')
            ? `/${relative.slice(0, -'/index.html'.length)}`
            : `/${relative}`;
      return [{ file, relative, route }];
    })
    .toSorted((left, right) => left.route.localeCompare(right.route, 'en'));

export function findIndexableRoutes(inputDirectory: string): string[] {
  return findIndexablePages(inputDirectory).map(({ route }) => route);
}

export function createPagefindBuilder(loadPagefind: LoadPagefind) {
  return async ({ inputDirectory, outputDirectory }: BuildPagefindOptions): Promise<void> => {
    const diagnostics: string[] = [];
    let indexablePages: IndexablePage[] = [];
    let pagefindInputDirectory: string | undefined;
    let api: PagefindNodeApi | undefined;
    let index: PagefindIndex | undefined;
    let pageCount: number | undefined;

    try {
      try {
        indexablePages = findIndexablePages(inputDirectory);
        pagefindInputDirectory = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-pagefind-input-'));
        for (const page of indexablePages) {
          const destination = path.resolve(pagefindInputDirectory, page.relative);
          mkdirSync(path.dirname(destination), { recursive: true });
          copyFileSync(page.file, destination);
        }
      } catch (error) {
        diagnostics.push(`prepareInput: ${errorMessage(error)}`);
      }

      try {
        if (diagnostics.length === 0) api = await loadPagefind();
      } catch (error) {
        diagnostics.push(`loadPagefind: ${errorMessage(error)}`);
      }

      if (api && diagnostics.length === 0) {
        try {
          const response = await api.createIndex({
            forceLanguage: 'en',
            rootSelector: PAGEFIND_ROOT_SELECTOR,
            writePlayground: false,
          });
          index = response.index;
          addErrors(diagnostics, 'createIndex', response.errors);
          if (!index) diagnostics.push('createIndex: Pagefind did not return an index');
        } catch (error) {
          diagnostics.push(`createIndex: ${errorMessage(error)}`);
        }
      }

      if (index && pagefindInputDirectory && diagnostics.length === 0) {
        try {
          const response = await index.addDirectory({ path: pagefindInputDirectory });
          pageCount = response.page_count;
          addErrors(diagnostics, 'addDirectory', response.errors);
          if (response.page_count !== indexablePages.length) {
            diagnostics.push(
              `addDirectory: Pagefind page count ${response.page_count} does not match ${indexablePages.length} indexable HTML routes`,
            );
          }
        } catch (error) {
          diagnostics.push(`addDirectory: ${errorMessage(error)}`);
        }
      }

      if (index && diagnostics.length === 0) {
        try {
          const response = await index.writeFiles({ outputPath: outputDirectory });
          addErrors(diagnostics, 'writeFiles', response.errors);
          if (response.errors.length === 0) {
            writeFileSync(
              path.resolve(outputDirectory, 'pagefind-audit.json'),
              `${JSON.stringify(
                {
                  pageCount,
                  routes: indexablePages.map(({ route }) => route),
                  schemaVersion: 1,
                },
                null,
                2,
              )}\n`,
            );
          }
        } catch (error) {
          diagnostics.push(`writeFiles: ${errorMessage(error)}`);
        }
      }
    } finally {
      if (index) {
        try {
          await index.deleteIndex();
        } catch (error) {
          diagnostics.push(`deleteIndex: ${errorMessage(error)}`);
        }
      }
      if (api) {
        try {
          await api.close();
        } catch (error) {
          diagnostics.push(`close: ${errorMessage(error)}`);
        }
      }
      if (pagefindInputDirectory) {
        try {
          rmSync(pagefindInputDirectory, { force: true, recursive: true });
        } catch (error) {
          diagnostics.push(`cleanupInput: ${errorMessage(error)}`);
        }
      }
    }

    if (diagnostics.length > 0) {
      throw new Error(`Pagefind build failed:\n- ${diagnostics.join('\n- ')}`);
    }
  };
}

export const buildPagefind = createPagefindBuilder(() => import('pagefind'));
