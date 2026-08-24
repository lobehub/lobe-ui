import { createReleaseConfig } from '../../scripts/release/config.mjs';

export default createReleaseConfig({
  scopes: ['streamdown'],
  tagFormat: 'streamdown@${version}',
});
