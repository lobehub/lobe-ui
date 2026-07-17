import { resolve } from 'node:path';

import {
  buildDocumentationInventory,
  writeCompatibilityManifest,
} from '../packages/docs-kit/site/compiler/inventory';
import { getDocsConfig } from '../packages/docs-kit/src/config';

const root = resolve(import.meta.dirname, '..');
const config = getDocsConfig(root);
const inventory = buildDocumentationInventory(root, {
  atomDirs: config.atomDirs,
  legacyRedirects: config.legacyRedirects,
  navSections: config.navSections,
  publicDocs: config.publicDocs,
});
writeCompatibilityManifest(root, inventory);
