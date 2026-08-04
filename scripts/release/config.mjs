import { fileURLToPath } from 'node:url';

import { semanticRelease } from '@lobehub/lint';
import gitmojiPreset from 'conventional-changelog-gitmoji-config';

const scopedCommits = fileURLToPath(new URL('./scoped-commits.mjs', import.meta.url));

const writerOpts = {
  ...gitmojiPreset.writerOpts,
  transform: (commit, context) =>
    gitmojiPreset.writerOpts.transform(
      {
        ...commit,
        notes: commit.notes.map((note) => ({ ...note })),
        references: commit.references.map((reference) => ({ ...reference })),
      },
      context,
    ),
};

export const createReleaseConfig = ({ exclude = false, scopes, tagFormat = 'v${version}' }) => {
  const plugins = semanticRelease.plugins.flatMap((plugin) => {
    const [name, options = {}] = Array.isArray(plugin) ? plugin : [plugin];

    // semantic-release 25 expects `config` presets to export a factory, while the
    // gitmoji preset exports its resolved options as a CommonJS object.
    const rest = Object.fromEntries(Object.entries(options).filter(([key]) => key !== 'config'));

    if (name === '@semantic-release/commit-analyzer') {
      return [
        [
          scopedCommits,
          { ...rest, exclude, parserOpts: gitmojiPreset.parserOpts, scopes, writerOpts },
        ],
      ];
    }

    // scopedCommits already provides generateNotes; keeping the official plugin
    // as well would run the step twice and duplicate every release note.
    if (name === '@semantic-release/release-notes-generator') return [];

    return [plugin];
  });

  return { ...semanticRelease, plugins, tagFormat };
};
