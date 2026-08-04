import { createReleaseConfig } from './scripts/release/config.mjs';

// `docs` is excluded here but claimed by no stream: it has been used both for
// docs-kit source and for repo-level content, so it releases nothing at all
// rather than releasing the wrong package.
export default createReleaseConfig({ exclude: true, scopes: ['docs', 'docs-kit'] });
