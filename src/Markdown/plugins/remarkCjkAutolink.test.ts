import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';

import { remarkCjkAutolink } from './remarkCjkAutolink';

/** 返回首段的子节点，只保留我们关心的字段 */
const parse = async (md: string) => {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkCjkAutolink);
  const tree: any = await processor.run(processor.parse(md));

  return tree.children[0].children.map((node: any) =>
    node.type === 'link'
      ? { text: node.children.map((c: any) => c.value).join(''), type: 'link', url: node.url }
      : { type: node.type, value: node.value },
  );
};

describe('remarkCjkAutolink', () => {
  it('stops the autolink at a full-width closing paren', async () => {
    expect(
      await parse('文档已完成（https://lobehub.com/page/docs_X）。四条验收标准都已提交。'),
    ).toEqual([
      { type: 'text', value: '文档已完成（' },
      {
        text: 'https://lobehub.com/page/docs_X',
        type: 'link',
        url: 'https://lobehub.com/page/docs_X',
      },
      { type: 'text', value: '）。四条验收标准都已提交。' },
    ]);
  });

  it.each(['。', '，', '、', '；', '：', '！', '？', '」', '】', '》', '…'])(
    'stops the autolink at %s',
    async (punctuation) => {
      expect(await parse(`见 https://a.com/b${punctuation}后文`)).toEqual([
        { type: 'text', value: '见 ' },
        { text: 'https://a.com/b', type: 'link', url: 'https://a.com/b' },
        { type: 'text', value: `${punctuation}后文` },
      ]);
    },
  );

  it('keeps the http:// prefix added for www links', async () => {
    expect(await parse('见 www.a.com，后文')).toEqual([
      { type: 'text', value: '见 ' },
      { text: 'www.a.com', type: 'link', url: 'http://www.a.com' },
      { type: 'text', value: '，后文' },
    ]);
  });

  it('keeps non-ASCII paths that contain no CJK punctuation', async () => {
    const url = 'https://zh.wikipedia.org/wiki/中文';

    expect(await parse(`见 ${url} 的说明`)).toEqual([
      { type: 'text', value: '见 ' },
      { text: url, type: 'link', url },
      { type: 'text', value: ' 的说明' },
    ]);
  });

  it('leaves ASCII-only autolinks untouched', async () => {
    const url = 'https://a.com/b?c=1&d=2';

    expect(await parse(`see ${url} ok`)).toEqual([
      { type: 'text', value: 'see ' },
      { text: url, type: 'link', url },
      { type: 'text', value: ' ok' },
    ]);
  });

  it('re-links a second URL that sat in the swallowed tail', async () => {
    expect(await parse('见 https://a.com。https://b.com。')).toEqual([
      { type: 'text', value: '见 ' },
      { text: 'https://a.com', type: 'link', url: 'https://a.com' },
      { type: 'text', value: '。' },
      { text: 'https://b.com', type: 'link', url: 'https://b.com' },
      { type: 'text', value: '。' },
    ]);
  });

  it('does not touch explicit links', async () => {
    expect(await parse('[文字](https://b.com/x）y)')).toEqual([
      { text: '文字', type: 'link', url: 'https://b.com/x）y' },
    ]);
  });
});
