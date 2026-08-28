import type { ElementContent, Root } from 'hast';
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic';
import { toText } from 'hast-util-to-text';
import katex, { type KatexOptions } from 'katex';
import { SKIP, visitParents } from 'unist-util-visit-parents';
import type { VFile } from 'vfile';

// 内联自 rehype-katex@7，因为它硬依赖 katex ^0.16，下游安装时会得到一份嵌套的
// 0.16 渲染出 v0.18 之前的 class 名，与我们注入的 v0.18 样式表对不上。
// 升级 rehype-katex 到支持 katex ^0.18 的版本后可以删掉本文件。

export type RehypeKatexOptions = Omit<KatexOptions, 'displayMode' | 'throwOnError'>;

const emptyClasses: unknown[] = [];

export const rehypeKatex =
  (options?: RehypeKatexOptions) =>
  (tree: Root, file: VFile): undefined => {
    const settings = options || {};

    visitParents(tree, 'element', (element, parents) => {
      const classes = Array.isArray(element.properties.className)
        ? element.properties.className
        : emptyClasses;
      const languageMath = classes.includes('language-math');
      const mathDisplay = classes.includes('math-display');
      const mathInline = classes.includes('math-inline');
      let displayMode = mathDisplay;

      if (!languageMath && !mathDisplay && !mathInline) return;

      let parent: any = parents.at(-1);
      let scope: any = element;

      if (
        element.tagName === 'code' &&
        languageMath &&
        parent &&
        parent.type === 'element' &&
        parent.tagName === 'pre'
      ) {
        scope = parent;
        parent = parents.at(-2);
        displayMode = true;
      }

      if (!parent) return;

      const value = toText(scope, { whitespace: 'pre' });

      let result: ElementContent[] | string | undefined;

      try {
        result = katex.renderToString(value, { ...settings, displayMode, throwOnError: true });
      } catch (error) {
        const cause = error as Error;

        file.message('Could not render math with KaTeX', {
          ancestors: [...parents, element],
          cause,
          place: element.position,
          ruleId: cause.name.toLowerCase(),
          source: 'rehype-katex',
        });

        try {
          result = katex.renderToString(value, {
            ...settings,
            displayMode,
            strict: 'ignore',
            throwOnError: false,
          });
        } catch {
          result = [
            {
              children: [{ type: 'text', value }],
              properties: {
                className: ['katex-error'],
                style: 'color:' + (settings.errorColor || '#cc0000'),
                title: String(error),
              },
              tagName: 'span',
              type: 'element',
            },
          ];
        }
      }

      if (typeof result === 'string') {
        result = fromHtmlIsomorphic(result, { fragment: true }).children as ElementContent[];
      }

      const index = parent.children.indexOf(scope);
      parent.children.splice(index, 1, ...result);
      return SKIP;
    });
  };
