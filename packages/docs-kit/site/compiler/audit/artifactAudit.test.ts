import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import type { DocumentManifestEntry } from '../../types/content';
import { createRobots, createSitemap } from '../seo/createSitemap';
import type { DocumentationInventory } from '../types';
import {
  analyzeMigrationCoverage,
  auditDocumentationArtifact,
  collectArtifactDiagnostics,
} from './artifactAudit';

const temporaryRoots: string[] = [];

const write = (root: string, relative: string, contents: string | Uint8Array): void => {
  const file = path.resolve(root, relative);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, contents);
};

const buttonDocument: DocumentManifestEntry = {
  category: 'General',
  description: 'Triggers an action.',
  pathname: '/components/button',
  source: 'src/Button/index.mdx',
  title: 'Button',
};

const buttonCompatibility = {
  description: 'Triggers an action.',
  legacyRouteId: 'components/Button/index',
  pathname: '/components/button',
  section: 'components',
  source: 'src/Button/index.md',
  title: 'Button',
};

const compatibility = (documents = [buttonCompatibility]): DocumentationInventory => ({
  demoReferences: [],
  documents,
});

const validDocumentHtml = () => `<!doctype html><html><head>
<title>Button - Lobe UI</title>
<meta name="description" content="Triggers an action.">
<link rel="canonical" href="https://ui.lobehub.com/components/button">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Lobe UI">
<meta property="og:title" content="Button - Lobe UI">
<meta property="og:description" content="Triggers an action.">
<meta property="og:url" content="https://ui.lobehub.com/components/button">
<meta property="og:image" content="https://repository-images.githubusercontent.com/643435168/789cab53-cae5-43fa-965d-5928c3c63c1c">
<meta name="twitter:card" content="summary_large_image">
</head><body><article data-pagefind-body><h1 id="button">Button</h1><h2 id="usage">Usage</h2><a href="#usage">Usage</a></article></body></html>`;

const createValidFixture = (withData = false) => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-artifact-'));
  temporaryRoots.push(root);
  const repositoryRoot = path.resolve(root, 'repository');
  const clientDirectory = path.resolve(root, 'client');
  const outputDirectory = path.resolve(root, 'dist');
  write(repositoryRoot, 'src/Button/index.mdx', '---\ntitle: Button\n---');
  write(outputDirectory, 'components/button/index.html', validDocumentHtml());
  write(
    outputDirectory,
    '~demos/legacy/index.html',
    '<html><head><meta name="robots" content="noindex, nofollow"></head><body data-standalone-demo></body></html>',
  );
  write(
    outputDirectory,
    '404.html',
    '<html><head><title>Documentation not found - Lobe UI</title><meta name="robots" content="noindex, nofollow"></head></html>',
  );
  write(outputDirectory, '__spa-fallback.html', '<html><body>SPA fallback</body></html>');
  write(outputDirectory, 'pagefind/pagefind.js', 'export const search = true;');
  write(outputDirectory, 'pagefind/index.pf_index', 'index');
  write(
    outputDirectory,
    'pagefind/pagefind-audit.json',
    JSON.stringify({ pageCount: 1, routes: ['/components/button'], schemaVersion: 1 }),
  );
  write(outputDirectory, 'sitemap.xml', createSitemap(['/components/button']));
  write(outputDirectory, 'robots.txt', createRobots());
  if (withData) {
    write(clientDirectory, 'components/button.data', 'payload');
    write(outputDirectory, 'components/button.data', 'payload');
  }

  return { clientDirectory, outputDirectory, repositoryRoot };
};

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

it('derives partial and complete migration phases from the expected MDX files', () => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-migration-phase-'));
  temporaryRoots.push(root);
  const documents = [
    buttonCompatibility,
    {
      ...buttonCompatibility,
      legacyRouteId: 'components/Input/index',
      pathname: '/components/input',
      source: 'src/Input/index.md',
      title: 'Input',
    },
  ];
  write(root, 'src/Button/index.mdx', 'Button');

  const partial = analyzeMigrationCoverage({
    compatibility: compatibility(documents),
    documents: [buttonDocument],
    repositoryRoot: root,
  });
  expect(partial).toMatchObject({ diagnostics: [], migrated: 1, phase: 'partial', total: 2 });

  write(root, 'src/Input/index.mdx', 'Input');
  write(root, 'src/Input/index.md', 'stale legacy input');
  const completeWithLegacy = analyzeMigrationCoverage({
    compatibility: compatibility(documents),
    documents: [
      buttonDocument,
      {
        ...buttonDocument,
        pathname: '/components/input',
        source: 'src/Input/index.mdx',
        title: 'Input',
      },
    ],
    repositoryRoot: root,
  });
  expect(completeWithLegacy.phase).toBe('complete');
  expect(completeWithLegacy.diagnostics.join('\n')).toMatch(/legacy.*src\/Input\/index\.md/i);

  rmSync(path.resolve(root, 'src/Input/index.md'));
  expect(
    analyzeMigrationCoverage({
      compatibility: compatibility(documents),
      documents: [
        buttonDocument,
        {
          ...buttonDocument,
          pathname: '/components/input',
          source: 'src/Input/index.mdx',
          title: 'Input',
        },
      ],
      repositoryRoot: root,
    }),
  ).toMatchObject({ diagnostics: [], migrated: 2, phase: 'complete', total: 2 });
});

it('rejects a migrated document omitted from the manifest and a frozen pathname mismatch', () => {
  const { repositoryRoot } = createValidFixture();

  const omitted = analyzeMigrationCoverage({
    compatibility: compatibility(),
    documents: [],
    repositoryRoot,
  });
  expect(omitted.diagnostics.join('\n')).toMatch(/migrated.*src\/Button\/index\.mdx.*manifest/i);

  const mismatched = analyzeMigrationCoverage({
    compatibility: compatibility(),
    documents: [{ ...buttonDocument, pathname: '/components/not-button' }],
    repositoryRoot,
  });
  expect(mismatched.diagnostics.join('\n')).toMatch(
    /frozen pathname.*components\/button.*not-button/i,
  );
});

it('accepts manifest documents without frozen records and rejects duplicate entries', () => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-migration-exact-'));
  temporaryRoots.push(root);
  const inputCompatibility = {
    ...buttonCompatibility,
    legacyRouteId: 'components/Input/index',
    pathname: '/components/input',
    source: 'src/Input/index.md',
    title: 'Input',
  };
  write(root, 'src/Button/index.mdx', 'Button');

  const result = analyzeMigrationCoverage({
    compatibility: compatibility([buttonCompatibility, inputCompatibility]),
    documents: [
      buttonDocument,
      {
        ...buttonDocument,
        pathname: '/components/input',
        source: 'src/Input/index.mdx',
        title: 'Input',
      },
      { ...buttonDocument },
      { ...buttonDocument, source: 'src/Input/index.mdx', title: 'Input duplicate' },
    ],
    repositoryRoot: root,
  });
  const message = result.diagnostics.join('\n');

  expect(message).not.toMatch(/no frozen compatibility record/i);
  expect(message).toMatch(/duplicate manifest source.*src\/Button\/index\.mdx/i);
  expect(message).toMatch(/duplicate manifest source.*src\/Input\/index\.mdx/i);
  expect(message).toMatch(/duplicate manifest pathname.*components\/button/i);
});

it('accepts a complete valid artifact and treats an empty data set as valid', () => {
  const fixture = createValidFixture();

  expect(() =>
    auditDocumentationArtifact({
      ...fixture,
      compatibility: compatibility(),
      documents: [buttonDocument],
      expectedStandalonePaths: ['/~demos/legacy'],
    }),
  ).not.toThrow();
});

it('requires standalone artifacts to remain both noindex and nofollow', () => {
  const fixture = createValidFixture();
  write(
    fixture.outputDirectory,
    '~demos/legacy/index.html',
    '<html><head><meta name="robots" content="noindex"></head><body data-standalone-demo></body></html>',
  );

  const diagnostics = collectArtifactDiagnostics({
    ...fixture,
    compatibility: compatibility(),
    documents: [buttonDocument],
    expectedStandalonePaths: ['/~demos/legacy'],
  }).diagnostics.join('\n');

  expect(diagnostics).toMatch(/standalone.*nofollow/i);
});

it('preserves the exact React Router data payload set when payloads are emitted', () => {
  const fixture = createValidFixture(true);

  auditDocumentationArtifact({
    ...fixture,
    compatibility: compatibility(),
    documents: [buttonDocument],
    expectedStandalonePaths: ['/~demos/legacy'],
  });
  expect(
    readFileSync(path.resolve(fixture.outputDirectory, 'components/button.data'), 'utf8'),
  ).toBe('payload');
});

it('aggregates metadata, routing, link, standalone, sitemap, Pagefind, fallback, and data failures', () => {
  const fixture = createValidFixture(true);
  write(
    fixture.outputDirectory,
    'components/button/index.html',
    '<html><head><title>Wrong</title><link rel="canonical" href="/components/button"></head><body><article data-pagefind-body><h2 id="duplicate">One</h2><h3 id="duplicate">Two</h3><a href="/components/missing#target">Missing</a></article></body></html>',
  );
  write(
    fixture.outputDirectory,
    '~demos/legacy/index.html',
    '<html><head><script defer data-domain="ui.lobehub.com" src="https://plausible.lobehub-inc.cn/js/script.js"></script></head><body></body></html>',
  );
  write(
    fixture.outputDirectory,
    'sitemap.xml',
    createSitemap(['/components/button']).replace(
      '</urlset>',
      '<url><loc>https://wrong.example/~demos/legacy</loc></url></urlset>',
    ),
  );
  rmSync(path.resolve(fixture.outputDirectory, 'pagefind'), { force: true, recursive: true });
  rmSync(path.resolve(fixture.outputDirectory, '__spa-fallback.html'));
  rmSync(path.resolve(fixture.outputDirectory, 'components/button.data'));

  const { diagnostics } = collectArtifactDiagnostics({
    ...fixture,
    compatibility: compatibility(),
    documents: [buttonDocument],
    expectedStandalonePaths: ['/~demos/legacy'],
  });
  const message = diagnostics.join('\n');

  expect(message).toMatch(/description/i);
  expect(message).toMatch(/canonical.*absolute|canonical.*https:\/\/ui\.lobehub\.com/i);
  expect(message).toMatch(/Open Graph|og:/i);
  expect(message).toMatch(/duplicate.*duplicate/i);
  expect(message).toMatch(/components\/missing/i);
  expect(message).toMatch(/standalone.*noindex/i);
  expect(message).toMatch(/standalone.*Plausible/i);
  expect(message).toMatch(/sitemap.*~demos/i);
  expect(message).toMatch(/Pagefind.*pagefind\.js/i);
  expect(message).toMatch(/__spa-fallback\.html/i);
  expect(message).toMatch(/button\.data/i);
  expect(diagnostics).toEqual(
    diagnostics.toSorted((left, right) => left.localeCompare(right, 'en')),
  );
});

it('follows static imports for initial bundle audits but ignores dynamic imports', () => {
  const fixture = createValidFixture();
  write(
    fixture.outputDirectory,
    'components/button/index.html',
    validDocumentHtml().replace(
      '</head>',
      '<link rel="modulepreload" href="/assets/document.js"></head>',
    ),
  );
  write(fixture.outputDirectory, 'assets/document.js', 'import "./LiveEditor.js";');
  write(fixture.outputDirectory, 'assets/LiveEditor.js', 'const packageName = "react-live";');

  const staticDiagnostics = collectArtifactDiagnostics({
    ...fixture,
    compatibility: compatibility(),
    documents: [buttonDocument],
    expectedStandalonePaths: ['/~demos/legacy'],
  }).diagnostics.join('\n');
  expect(staticDiagnostics).toMatch(/document\.js.*LiveEditor\.js.*react-live/i);

  write(
    fixture.outputDirectory,
    'assets/document.js',
    'export const loadEditor = () => import("./LiveEditor.js");',
  );
  const dynamicDiagnostics = collectArtifactDiagnostics({
    ...fixture,
    compatibility: compatibility(),
    documents: [buttonDocument],
    expectedStandalonePaths: ['/~demos/legacy'],
  }).diagnostics.join('\n');
  expect(dynamicDiagnostics).not.toMatch(/LiveEditor\.js|react-live/i);
});

it('starts dependency traversal from module scripts as well as preload hints', () => {
  const fixture = createValidFixture();
  write(
    fixture.outputDirectory,
    'components/button/index.html',
    validDocumentHtml().replace(
      '</body>',
      '<script type="module" src="/assets/entry.js"></script></body>',
    ),
  );
  write(fixture.outputDirectory, 'assets/entry.js', 'export { editor } from "./LiveEditor.js";');
  write(fixture.outputDirectory, 'assets/LiveEditor.js', 'export const editor = "react-live";');

  const diagnostics = collectArtifactDiagnostics({
    ...fixture,
    compatibility: compatibility(),
    documents: [buttonDocument],
    expectedStandalonePaths: ['/~demos/legacy'],
  }).diagnostics.join('\n');

  expect(diagnostics).toMatch(/entry\.js.*LiveEditor\.js.*react-live/i);
});

it('accepts legacy named anchors as valid internal fragment targets', () => {
  const fixture = createValidFixture();
  write(
    fixture.outputDirectory,
    'components/button/index.html',
    validDocumentHtml().replace(
      '<h1 id="button">',
      '<a name="readme-top"></a><a href="#readme-top">Back to top</a><h1 id="button">',
    ),
  );

  const diagnostics = collectArtifactDiagnostics({
    ...fixture,
    compatibility: compatibility(),
    documents: [buttonDocument],
    expectedStandalonePaths: ['/~demos/legacy'],
  }).diagnostics.join('\n');

  expect(diagnostics).not.toMatch(/readme-top.*no matching id/i);
});

it('rejects documentation registry chunks from a standalone initial graph', () => {
  const fixture = createValidFixture();
  write(
    fixture.outputDirectory,
    '~demos/legacy/index.html',
    '<html><head><meta name="robots" content="noindex, nofollow"><script type="module" src="/assets/standalone.js"></script></head></html>',
  );
  write(fixture.outputDirectory, 'assets/standalone.js', 'import "./registry.js";');
  write(fixture.outputDirectory, 'assets/registry.js', 'export const manifest = [];');

  const diagnostics = collectArtifactDiagnostics({
    ...fixture,
    compatibility: compatibility(),
    documents: [buttonDocument],
    expectedStandalonePaths: ['/~demos/legacy'],
  }).diagnostics.join('\n');

  expect(diagnostics).toMatch(/standalone\.js.*registry\.js.*documentation.*registry/i);
});

it('requires the Pagefind receipt to cover exactly the current documents and no demos', () => {
  const fixture = createValidFixture();
  write(
    fixture.outputDirectory,
    'pagefind/pagefind-audit.json',
    JSON.stringify({
      pageCount: 2,
      routes: ['/components/button', '/~demos/legacy'],
      schemaVersion: 1,
    }),
  );

  const diagnostics = collectArtifactDiagnostics({
    ...fixture,
    compatibility: compatibility(),
    documents: [buttonDocument],
    expectedStandalonePaths: ['/~demos/legacy'],
  }).diagnostics.join('\n');

  expect(diagnostics).toMatch(/Pagefind.*page count.*2.*document.*1/i);
  expect(diagnostics).toMatch(/Pagefind.*~demos\/legacy.*excluded/i);
  expect(diagnostics).toMatch(/Pagefind.*unexpected route.*~demos\/legacy/i);
});
