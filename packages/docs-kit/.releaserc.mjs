import { createReleaseConfig } from '../../scripts/release/config.mjs';

export default createReleaseConfig({
  scopes: ['docs-kit'],
  tagFormat: 'docs-kit@${version}',
});
