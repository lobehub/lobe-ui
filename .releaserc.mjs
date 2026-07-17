import { semanticRelease } from '@lobehub/lint';

const docsKitPackageJson = 'packages/docs-kit/package.json';

const plugins = semanticRelease.plugins.flatMap((plugin) => {
  const [pluginName, pluginOptions = {}] = Array.isArray(plugin) ? plugin : [plugin];

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
