import { resolve } from 'node:path';

import {
  buildDocumentationInventory,
  writeCompatibilityManifest,
} from '../packages/docs-kit/site/compiler/inventory';

const root = resolve(import.meta.dirname, '..');
const inventory = buildDocumentationInventory(root);
writeCompatibilityManifest(root, inventory);
