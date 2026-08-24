# @lobehub/streamdown — Headless 流式 Markdown 引擎抽取设计

日期:2026-08-24
状态:已确认设计,待实现计划

## 目标

把 lobe-ui 的 markdown 流式渲染核心抽成独立发布的 headless 库
`@lobehub/streamdown`,零 antd / antd-style 依赖,可在任意 React 项目中使用。
lobe-ui 改为消费该包,保留自己的样式外壳与组件层,对 lobe-ui 使用者零破坏。

## 定位

- **Headless 流式引擎**:分块、平滑流、动画 rehype 插件、块级缓存、LLM 文本预处理。
- 不带主题、不带排版样式、不带代码高亮 / Mermaid / HtmlPreview 等重渲染组件。
- 主入口是无样式组件 `<Streamdown>`,底层 hooks 与插件同时具名导出。

## 仓库形态

- monorepo 内新包 `packages/streamdown`,发布名 `@lobehub/streamdown`。
- ESM-only,React 19 peer,tsdown 构建,复用现有 semantic-release 多包流程
  (与 docs-kit 同模式)。
- lobe-ui 通过 workspace 协议依赖;docs.config / vitest alias 指回包源码
  (与现有 `@lobehub/ui` → `src` 同模式)。

## 包内容

### 从 `src/Markdown/SyntaxMarkdown/` 迁入(基本原样)

- `StreamdownRender`(marked 分块 + remend 修复未闭合语法 + 块级缓存编排)
- `CachedMarkdown`
- `useSmoothStreamContent`(平滑打字机)、`useStreamQueue`
- `fenceState`、`streamAnimationMeta` 及各自测试

### 其他迁入

- `plugins/rehypeStreamAnimated`(+ 测试)
- `streamProfiler/` 纯逻辑部分(profiler.ts、Provider),导出为子路径
  `@lobehub/streamdown/profiler`;带 UI 的 `StreamdownProfilerPanel` 留在 lobe-ui
- 预处理层(见下节)
- 内部小 util:`getNow`、`isDeepEqual`、`useStableValue` 复制进包内 internal,
  不对外导出

### 预处理层(自 `src/hooks/useMarkdown/`)

迁入:

- `latex.ts` 全部纯函数(`preprocessLaTeX`、`convertLatexDelimiters`、
  `escapeLatexPipes`、`isLastFormulaRenderable` 等)+ 测试
- 流式防闪逻辑:末尾公式未闭合时回退上一帧合法内容(现
  `useMarkdownContent` 中 `isLastFormulaRenderable` + `validContent` 部分),
  作为引擎内置能力

留在 lobe-ui:

- citations / footnotes 变换(`transformCitations` 等,lobe 业务特化)
- `useMarkdownComponents`(绑 A/Image/Highlighter 的组件映射层)

### 留在 lobe-ui 的其余部分

`Markdown.tsx` 外壳、`markdown.style.ts` 排版主题、`CodeBlock`、
`MarkdownTable`、`SearchResultCards`、`MarkdownProvider` context、mdx 相关、
`remarkGfmPlus` / `remarkBr` / `remarkColor` 等与流式无关的 remark 插件
(定位保持纯粹,后续有需要再评估)。

## 对外 API

```tsx
import { Streamdown } from '@lobehub/streamdown';

<Streamdown
  animated
  content={text}
  components={components} // props 直传,不再读 context
  remarkPlugins={remarkPlugins}
  rehypePlugins={rehypePlugins}
  smoothing="default" // StreamSmoothingPreset
  granularity="char" // StreamAnimationGranularity
  preprocess={fn} // 可选 (text: string) => string,默认不开
/>;
```

- 关键改动:现 `StreamdownRender` 从 lobe-ui `MarkdownProvider` context 读取
  components / plugins / content,抽出后全部改为 props。lobe-ui 的 `Markdown`
  继续维护自己的 context,在调用处把 context 值喂给 `<Streamdown>` props。
- 具名导出:`useSmoothStreamContent`、`useStreamQueue`、`rehypeStreamAnimated`、
  预处理纯函数、相关类型(`StreamSmoothingPreset`、
  `StreamAnimationGranularity` 等,类型从 `src/Markdown/type.ts` 中拆出流式
  相关部分随包迁移)。
- lobe-ui 用组件层;外部项目可用组件层或 hooks 层。

## 样式方案(去 antd-style)

流式核心唯一样式是 `.stream-char` 淡入(现 `SyntaxMarkdown/style.ts` 的
`createStaticStyles`)。改为:

- 包内常量 CSS 字符串,经 React 19 `<style href precedence>` hoisting 注入
  `<head>`(自动去重、SSR 安全)
- 类名保持 `stream-char` / `stream-char-revealed` 不变,根类
  `streamdown-animated`
- 动画时长固定为导出常量 `STREAM_FADE_DURATION`(180ms)。不提供 CSS 变量
  覆盖:JS 时序(useStreamQueue、streamAnimationMeta)依赖同一常量,
  仅覆盖 CSS 会让视觉与状态机脱钩
- KaTeX display 的 mask/animation 豁免规则一并迁入
- 不发 CSS 文件,不要求使用方配置构建

## 迁移与验证

1. 建 `packages/streamdown`,迁入上述代码,补 props 化改造
2. lobe-ui 删除 `SyntaxMarkdown/` 目录及迁走的 latex 预处理,改从
   `@lobehub/streamdown` 导入;`useMarkdownContent` 改为组合
   citations 变换 + 包导出的 latex 预处理传入 `preprocess`
3. 既有测试(`fenceState`、`streamAnimationMeta`、`rehypeStreamAnimated`、
   `profiler`、`latex`)随代码进包并在包内跑
4. lobe-ui 侧以现有 Markdown streaming demos 做回归(local-testing skill:
   streaming、streamingBench、math、htmlPreviewStream 等)
5. 发布走 semantic-release,不手动改版本

## 依赖

包 dependencies:`marked`、`remend`、`react-markdown`、`unified`、
`unist-util-visit`、`hast-util-to-jsx-runtime`、`html-url-attributes` 等
现有 unified 生态依赖。peer:`react` / `react-dom` >= 19。
零 antd、零 antd-style。
