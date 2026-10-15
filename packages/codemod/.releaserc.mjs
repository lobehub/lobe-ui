import { createReleaseConfig } from '../../scripts/release/config.mjs';

export default createReleaseConfig({
  scopes: ['codemod'],
  tagFormat: 'codemod@${version}',
});
