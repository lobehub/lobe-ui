import { applyTransforms } from '../../transform';
import { mergeImports } from './mergeImports';

const run = (code: string) => applyTransforms(code, 'a.tsx', [mergeImports]).code;

describe('mergeImports', () => {
  it('merges value imports from the same @lobehub/ui source into the first one', () => {
    expect(
      run(
        [
          `import { Button } from '@lobehub/ui';`,
          `import { useState } from 'react';`,
          `import { cx, Button as B } from '@lobehub/ui';`,
          `const x = 1;`,
        ].join('\n'),
      ),
    ).toBe(
      [
        `import { Button, cx, Button as B } from '@lobehub/ui';`,
        `import { useState } from 'react';`,
        `const x = 1;`,
      ].join('\n'),
    );
  });

  it('writes one specifier per line when a merged import was multi-line', () => {
    expect(
      run(
        [
          `import { Icon } from '@lobehub/ui';`,
          `import {`,
          `  ActionIcon,`,
          `  Button,`,
          `} from '@lobehub/ui';`,
        ].join('\n'),
      ),
    ).toBe(
      [`import {`, `  Icon,`, `  ActionIcon,`, `  Button,`, `} from '@lobehub/ui';`].join('\n'),
    );
  });

  it('writes one specifier per line when the merged line exceeds 100 characters', () => {
    const output = run(
      [
        `import { DropdownMenuGroup, DropdownMenuGroupLabel } from '@lobehub/ui';`,
        `import { DropdownMenuItemContent, DropdownMenuItemDesc } from '@lobehub/ui';`,
      ].join('\n'),
    );
    expect(output.split('\n')).toHaveLength(6);
  });

  it('leaves an import with its own leading comment out of the merge', () => {
    const code = [
      `import { Button } from '@lobehub/ui';`,
      `// @ts-expect-error legacy prop`,
      `import { cx } from '@lobehub/ui';`,
      `const x = 1;`,
    ].join('\n');
    expect(run(code)).toBe(code);
  });

  it('merges type-only imports separately from value imports', () => {
    expect(
      run(
        [
          `import type { LobeTheme } from '@lobehub/ui';`,
          `import { cx } from '@lobehub/ui';`,
          `import type { ButtonProps } from '@lobehub/ui';`,
          `import { Form } from '@lobehub/ui/form';`,
        ].join('\n'),
      ),
    ).toBe(
      [
        `import type { LobeTheme, ButtonProps } from '@lobehub/ui';`,
        `import { cx } from '@lobehub/ui';`,
        `import { Form } from '@lobehub/ui/form';`,
      ].join('\n'),
    );
  });

  it('leaves default, namespace, side-effect and foreign imports alone', () => {
    const code = [
      `import '@lobehub/ui/theme.css';`,
      `import * as UI from '@lobehub/ui';`,
      `import { cx } from '@lobehub/ui';`,
      `import { a } from 'other';`,
      `import { b } from 'other';`,
    ].join('\n');
    expect(run(code)).toBe(code);
  });
});
