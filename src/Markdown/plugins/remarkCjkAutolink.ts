import { gfmAutolinkLiteralFromMarkdown } from 'mdast-util-gfm-autolink-literal';
import { visit } from 'unist-util-visit';

/**
 * GFM 的 autolink literal 只会回溯裁剪 ASCII 的尾随标点（`)`、`.`、`,` 等），
 * 对中日韩常用的全角标点一无所知。于是模型输出里很常见的
 *
 *   调研文档已完成（https://example.com/page/docs_X）。四条验收标准…
 *
 * 会把 `）。四条验收标准…` 整段吞进 URL，渲染出一条超长的错误链接。
 *
 * 本插件在 remark-gfm 之后运行，把裸链接（link 文本与 url 相同的那种）在
 * 第一个全角/CJK 标点处截断，被截掉的部分按标点再切段并重新做一次 autolink，
 * 这样 `https://a.com。https://b.com` 里的第二条链接不会连带失效。
 *
 * 注意：只在标点处截断，不在汉字/假名处截断，所以 `https://zh.wikipedia.org/wiki/中文`
 * 这类合法的 IDN / 非 ASCII 路径不受影响；显式写出的 `[文本](url)` 也不会被改动。
 *
 * 参考：vercel/streamdown#326、ant-design/x#2055 —— 上游 remark-gfm 至今未处理。
 */

// 全角与 CJK 标点：〃〈〉《》「」『』【】〔〕〜、。 等，以及全角 ASCII 标点区、
// 竖排/兼容标点区，再补上中文常用的弯引号与省略号、破折号。
const CJK_PUNCTUATION = /[、-〃〈-】〔-〟〰︐-︙︰-﹏！-／：-＠［-｀｛-･‘’“”—…]/;

/** 裸链接的 url 相对于文本可能带上的协议前缀（`www.x.com` → `http://www.x.com`） */
const AUTO_PREFIXES = ['', 'http://', 'https://', 'mailto:', 'xmpp:'];

const autolinkTransforms = gfmAutolinkLiteralFromMarkdown().transforms ?? [];

const getAutolinkPrefix = (url: string, text: string): string | undefined =>
  AUTO_PREFIXES.find((prefix) => url === prefix + text);

/**
 * 把被截掉的尾巴按全角标点逐段切开，每段单独重新跑一次 GFM autolink，
 * 逐段处理是为了让标点本身始终停留在链接外面。
 */
const relinkify = (text: string): any[] => {
  const nodes: any[] = [];

  const pushSegment = (segment: string) => {
    if (!segment) return;

    const paragraph = { children: [{ type: 'text', value: segment }], type: 'paragraph' };
    const root = { children: [paragraph], type: 'root' };

    for (const transform of autolinkTransforms) transform(root as any);

    nodes.push(...paragraph.children);
  };

  let start = 0;

  for (let i = 0; i < text.length; i++) {
    if (!CJK_PUNCTUATION.test(text[i])) continue;

    pushSegment(text.slice(start, i));
    nodes.push({ type: 'text', value: text[i] });
    start = i + 1;
  }

  pushSegment(text.slice(start));

  // 合并相邻的纯文本节点，避免把一句话切成一串碎片
  return nodes.reduce<any[]>((acc, node) => {
    const prev = acc.at(-1);

    if (node.type === 'text' && prev?.type === 'text') {
      prev.value += node.value;
      return acc;
    }

    acc.push(node);
    return acc;
  }, []);
};

export const remarkCjkAutolink = () => {
  return (tree: any) => {
    visit(tree, 'link', (node: any, index, parent: any) => {
      if (!parent || typeof index !== 'number') return;
      if (node.children?.length !== 1) return;

      const child = node.children[0];
      if (child.type !== 'text' || typeof child.value !== 'string') return;
      if (typeof node.url !== 'string') return;

      // 只处理裸链接：link 的文本就是 url 本身（可能差一个协议前缀）
      const prefix = getAutolinkPrefix(node.url, child.value);
      if (prefix === undefined) return;

      const match = CJK_PUNCTUATION.exec(child.value);
      if (!match || match.index === 0) return;

      const kept = child.value.slice(0, match.index);

      child.value = kept;
      node.url = prefix + kept;

      // 位置信息已经失真，删掉以免下游（streaming 渲染）按旧位置复用
      delete node.position;
      delete child.position;

      const rest = relinkify(match.input.slice(match.index));
      parent.children.splice(index + 1, 0, ...rest);

      return index + rest.length + 1;
    });
  };
};
