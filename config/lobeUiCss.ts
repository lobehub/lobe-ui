import { readFileSync } from 'node:fs';

import stylex from '@stylexjs/unplugin/rolldown';
import type { Rolldown } from 'tsdown';

import { layerComponentCss } from './componentCss.ts';
import {
  isConstant,
  LAYER_ROOTS,
  layerOrder,
  type StylexRule,
  stylexRulesToCss,
} from './stylexCss.ts';

type StylexPlugin = Rolldown.Plugin & {
  __stylexGetSharedStore: () => { rulesById: Map<string, StylexRule[]> };
};

export interface ComponentStylesheet {
  entry: string;
  fileName: string;
}

const uniqueRules = (rules: StylexRule[]) => [
  ...new Map(rules.map((rule) => [rule[0], rule])).values(),
];

const lobeUiCss = ({
  components,
  getRules,
}: {
  components: ComponentStylesheet[];
  getRules: () => Map<string, StylexRule[]>;
}): Rolldown.Plugin => {
  const sheetsByImporter = new Map<string, Set<string>>();
  return {
    buildStart() {
      sheetsByImporter.clear();
    },
    generateBundle(_options, bundle) {
      const handWritten = new Map<string, string>();
      for (const sheets of sheetsByImporter.values()) {
        for (const file of sheets) {
          if (!handWritten.has(file)) {
            handWritten.set(file, layerComponentCss(readFileSync(file, 'utf8'), file));
          }
        }
      }

      const rulesById = getRules();
      const chunks = Object.values(bundle).filter((item) => item.type === 'chunk');
      const bundled = new Set(chunks.flatMap((chunk) => chunk.moduleIds));
      const all = [...bundled].flatMap((id) => rulesById.get(id) ?? []);
      // defineConsts modules are inlined at compile time and tree-shaken out of every chunk, yet
      // the atoms still reference their values.
      const constants = [...rulesById.values()].flat().filter(isConstant);
      const order = layerOrder(all);

      const stylesheet = (moduleIds: Iterable<string>) => {
        const ids = [...moduleIds].filter((id) => bundled.has(id));
        const sheets = new Set(ids.flatMap((id) => [...(sheetsByImporter.get(id) ?? [])]));
        const atoms = stylexRulesToCss(uniqueRules(ids.flatMap((id) => rulesById.get(id) ?? [])), {
          constants,
          order,
        });
        return [LAYER_ROOTS, ...[...sheets].toSorted().map((file) => handWritten.get(file)), atoms]
          .filter(Boolean)
          .join('\n\n');
      };

      this.emitFile({ fileName: 'style.css', source: stylesheet(bundled), type: 'asset' });

      for (const { entry, fileName } of components) {
        if (!this.getModuleInfo(entry)) this.error(`${entry} is not part of this build`);
        const reached = new Set<string>();
        const visit = (id: string) => {
          if (reached.has(id)) return;
          const info = this.getModuleInfo(id);
          if (!info) return;
          reached.add(id);
          for (const next of [...info.importedIds, ...info.dynamicallyImportedIds]) visit(next);
        };
        visit(entry);
        const source = stylesheet(reached);
        if (source !== LAYER_ROOTS) this.emitFile({ fileName, source, type: 'asset' });
      }
    },
    name: 'lobe-ui:css',
    resolveId: {
      filter: { id: /\.css$/ },
      async handler(source, importer) {
        const resolved = await this.resolve(source, importer, { skipSelf: true });
        if (!resolved) this.error(`Cannot resolve ${source} from ${importer}`);
        if (importer) {
          const sheets = sheetsByImporter.get(importer) ?? new Set();
          sheets.add(resolved.id);
          sheetsByImporter.set(importer, sheets);
        }
        return { external: true, id: source, moduleSideEffects: false };
      },
    },
  };
};

// The StyleX plugin's own output hooks append one sheet to the first CSS asset; lobeUiCss writes
// every sheet itself, so only its transform is kept.
export const lobeUiStylex = ({
  components = [],
  stylex: options,
}: {
  components?: ComponentStylesheet[];
  stylex: Parameters<typeof stylex>[0];
}) => {
  const {
    generateBundle: _generateBundle,
    writeBundle: _writeBundle,
    ...transform
  } = stylex(options) as StylexPlugin;
  return {
    css: lobeUiCss({
      components,
      getRules: () => transform.__stylexGetSharedStore().rulesById,
    }),
    transform: transform as Rolldown.Plugin,
  };
};
