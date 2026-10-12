import { mockSources, moduleSources } from '../../ast';
import type { Transform } from '../../transform';

export const BASE_UI_REPLACEMENTS: Record<string, string> = {
  '@lobehub/ui/base-ui': '@lobehub/ui',
  '@lobehub/ui/base-ui/form': '@lobehub/ui/form',
};

export const baseUiSubpath: Transform = ({ ast, ms }) => {
  const mocks = new Set(mockSources(ast));
  const mocked = new Set([...mocks].map((source) => source.value));
  for (const source of moduleSources(ast)) {
    const replacement = BASE_UI_REPLACEMENTS[source.value];
    if (!replacement || (mocks.has(source) && mocked.has(replacement))) continue;
    ms.overwrite(source.start! + 1, source.end! - 1, replacement);
  }
};
