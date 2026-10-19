import { codeDiffClasses, patchDiffClasses } from '@/CodeDiff/stable';
import { codeEditorClasses } from '@/CodeEditor/stable';
import { formClasses } from '@/Form/stable';
import { Form as FormKit, useForm } from '@/FormKit';
import { formKitClasses } from '@/FormKit/stable';
import { highlighterClasses, syntaxHighlighterClasses } from '@/Highlighter/stable';
import { htmlPreviewClasses, htmlPreviewIframeClasses } from '@/HtmlPreview/stable';
import {
  CodeDiff,
  CodeEditor,
  Form,
  Highlighter,
  HtmlPreview,
  HtmlPreviewIframe,
  Markdown,
  Mermaid,
  PatchDiff,
  SearchResultCards,
  Snippet,
  SyntaxHighlighter,
  SyntaxMermaid,
  Table,
  ThemeScope,
  Typography,
} from '@/index';
import { markdownClasses, searchResultCardsClasses, typographyClasses } from '@/Markdown/stable';
import { mermaidClasses, syntaxMermaidClasses } from '@/Mermaid/stable';
import { ProTable } from '@/ProTable';
import { proTableClasses } from '@/ProTable/stable';
import { snippetClasses } from '@/Snippet/stable';
import { themeScopeClasses } from '@/styles/theme/stable';
import { tableClasses } from '@/Table/stable';

import type { StableFixture } from './stableClasses.fixtures';

const PATCH = `--- a/a.ts
+++ b/a.ts
@@ -1 +1 @@
-const a = 1;
+const a = 2;
`;

const FormKitFixture = ({ className }: { className?: string }) => {
  const form = useForm({ initialValues: { name: '' } });
  return (
    <FormKit
      className={className}
      form={form}
      items={[{ children: [{ children: <input />, label: 'Name', name: 'name' }], title: 'Group' }]}
    />
  );
};

const FORM_CONDITIONAL = [
  'flat-group',
  'group-trigger',
  'group-desc',
  'field-error',
  'divider',
  'title-tag',
  'title-desc',
  'footer',
  'submit-footer',
  'unsaved',
] as const;

export const CONTENT_FIXTURES: Record<string, StableFixture> = {
  'CodeDiff': {
    classes: codeDiffClasses,
    conditional: ['language', 'actions'],
    render: ({ className }) => (
      <CodeDiff
        className={className}
        fileName="a.ts"
        language="ts"
        newContent="const a = 2;"
        oldContent="const a = 1;"
      />
    ),
  },
  'CodeEditor': {
    classes: codeEditorClasses,
    render: ({ className }) => (
      <CodeEditor
        className={className}
        language="ts"
        value="const a = 1;"
        onValueChange={() => {}}
      />
    ),
  },
  'Form': {
    classes: formClasses,
    conditional: FORM_CONDITIONAL,
    render: ({ className }) => (
      <Form
        className={className}
        items={[{ children: [{ children: <input />, label: 'Name' }], title: 'Group' }]}
      />
    ),
  },
  'Highlighter': {
    classes: highlighterClasses,
    conditional: ['header', 'title', 'panel-actions', 'expand-toggle', 'body'],
    render: ({ className }) => (
      <Highlighter className={className} language="ts">
        const a = 1;
      </Highlighter>
    ),
  },
  'HtmlPreview': {
    classes: htmlPreviewClasses,
    conditional: ['content', 'iframe', 'loading', 'loading-source', 'loading-badge'],
    render: ({ className }) => <HtmlPreview className={className}>{'<p>Hello</p>'}</HtmlPreview>,
  },
  'HtmlPreviewIframe': {
    classes: htmlPreviewIframeClasses,
    render: ({ className }) => <HtmlPreviewIframe className={className} content="<p>Hello</p>" />,
  },
  'Markdown': {
    classes: markdownClasses,
    render: ({ className }) => <Markdown className={className}>**Hello**</Markdown>,
  },
  'Mermaid': {
    blockQuery: true,
    classNameTarget: 'wrapper',
    classes: mermaidClasses,
    conditional: ['header', 'title', 'panel-actions', 'expand-toggle', 'body'],
    render: ({ className }) => <Mermaid className={className}>{'graph TD; A-->B'}</Mermaid>,
  },
  'PatchDiff': {
    classes: patchDiffClasses,
    conditional: ['language', 'actions'],
    render: ({ className }) => <PatchDiff className={className} fileName="a.ts" patch={PATCH} />,
  },
  'SearchResultCards': {
    classes: searchResultCardsClasses,
    render: ({ className }) => (
      <SearchResultCards className={className} dataSource={['https://lobehub.com']} />
    ),
  },
  'Snippet': {
    classes: snippetClasses,
    conditional: ['spotlight'],
    render: ({ className }) => <Snippet className={className}>npm i @lobehub/ui</Snippet>,
  },
  'SyntaxHighlighter': {
    classes: syntaxHighlighterClasses,
    render: ({ className }) => (
      <SyntaxHighlighter className={className} language="ts">
        const a = 1;
      </SyntaxHighlighter>
    ),
  },
  'SyntaxMermaid': {
    classes: syntaxMermaidClasses,
    conditional: ['diagram', 'fallback'],
    render: ({ className }) => (
      <SyntaxMermaid className={className} fallbackClassName={className}>
        {'graph TD; A-->B'}
      </SyntaxMermaid>
    ),
  },
  'Table': {
    blockQuery: true,
    classNameTarget: 'wrapper',
    classes: tableClasses,
    conditional: ['title', 'footer'],
    render: ({ className }) => (
      <Table
        className={className}
        columns={[{ dataIndex: 'name', key: 'name', title: 'Name' }]}
        dataSource={[{ key: '1', name: 'Alpha' }]}
      />
    ),
  },
  'ThemeScope': {
    classes: themeScopeClasses,
    render: ({ className }) => <ThemeScope className={className}>Scoped</ThemeScope>,
  },
  'Typography': {
    classes: typographyClasses,
    render: ({ className }) => <Typography className={className}>Text</Typography>,
  },
  'form/Form': {
    classes: formKitClasses,
    conditional: [
      ...FORM_CONDITIONAL,
      'field-required',
      'field-extra',
      'list',
      'list-head',
      'list-title',
      'list-empty',
      'list-row',
      'list-cell',
      'list-remove',
      'list-add',
      'list-foot',
    ],
    render: ({ className }) => <FormKitFixture className={className} />,
  },
  'pro-table/ProTable': {
    classes: proTableClasses,
    conditional: ['search', 'toolbar', 'toolbar-title', 'alert', 'alert-info', 'alert-option'],
    render: ({ className }) => (
      <ProTable
        className={className}
        columns={[{ dataIndex: 'name', title: 'Name' }]}
        dataSource={[{ id: '1', name: 'Alpha' }]}
        rowKey="id"
        search={false}
      />
    ),
  },
};
