import { semanticRelease } from '@lobehub/lint';
import gitmojiPreset from 'conventional-changelog-gitmoji-config';

const docsKitPackageJson = 'packages/docs-kit/package.json';
const gitmojiWriterOpts = {
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

const plugins = semanticRelease.plugins.flatMap((plugin) => {
  const [pluginName, pluginOptions = {}] = Array.isArray(plugin) ? plugin : [plugin];

  // semantic-release 25 expects `config` presets to export a factory, while the
  // gitmoji preset exports its resolved options as a CommonJS object.
  const options = Object.fromEntries(
    Object.entries(pluginOptions).filter(([key]) => key !== 'config'),
  );

  if (pluginName === '@semantic-release/commit-analyzer') {
    return [[pluginName, { ...options, parserOpts: gitmojiPreset.parserOpts }]];
  }

  if (pluginName === '@semantic-release/release-notes-generator') {
    return [
      [
        pluginName,
        {
          ...options,
          parserOpts: gitmojiPreset.parserOpts,
          writerOpts: gitmojiWriterOpts,
        },
      ],
    ];
  }

  if (pluginName !== '@semantic-release/git') return [plugin];

  return [
    ['@semantic-release/npm', { pkgRoot: 'packages/docs-kit' }],
    [
      pluginName,
      {
        ...pluginOptions,
        assets: [...pluginOptions.assets, docsKitPackageJson],
      },
    ],
  ];
});

export default { ...semanticRelease, plugins };
