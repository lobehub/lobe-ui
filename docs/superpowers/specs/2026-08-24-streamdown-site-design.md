# Streamdown Demo Site 设计

日期:2026-08-24
状态:已确认设计,inline 实施

## 目标

给 `@lobehub/streamdown` 做专属 demo site:单页 landing,含 live demo、
playground、benchmark(自身 profiler 可视化)。站点自身零 antd / 零 UI 库,
作为 headless 用法的活示范(dogfooding:站内 markdown 均由 `<Streamdown>`
渲染)。

## 栈与位置

- `packages/streamdown/site/`,纯 Vite + React 19 SPA,private 包不发布。
- 依赖仅 `react`、`react-dom`、`@lobehub/streamdown`(workspace)、`vite`、
  `@vitejs/plugin-react`。
- dev alias `@lobehub/streamdown` → `../src`(含 `/profiler` 子路径)。
- 手写一份 CSS:CSS 变量主题,跟随 `prefers-color-scheme`,无手动切换。

## 页面结构(单页)

1. **Hero**:标题、定位一句话、自动循环播放的流式渲染演示(标题/列表/
   代码块/公式/表格混合内容)、`pnpm add @lobehub/streamdown` 复制按钮。
2. **Playground + Benchmark(同屏联动)**:
   - 左控件右渲染:样例切换(markdown 全家桶 / LaTeX / 长代码)、产出
     速率与 chunk 大小滑块、`smoothing` 三预置、`granularity` char/word、
     `latexGuard` 开关、重播。
   - 渲染区包 `StreamdownProfilerProvider`;profiler 指标实时展示:FPS
     sparkline、reveal commit 耗时 avg/max、逐块 commit 统计、输入速率。
     面板为站内新写轻量组件(数据来自 `@lobehub/streamdown/profiler`),
     不搬 lobe-ui 的 StreamdownProfilerPanel。
3. **页脚**:API 速查(props 静态表,Streamdown 渲染)+ GitHub/npm 链接。

## 代码组织

```
packages/streamdown/site/
  index.html  vite.config.ts  package.json  tsconfig.json
  src/
    App.tsx  main.tsx  styles.css
    sections/{Hero,Playground,ProfilerPanel}.tsx
    lib/{createLocalStream.ts, samples.ts}
```

- 流源与样本从 `src/Markdown/demos/` 的 createLocalStream / content 思路
  复制适配。
- markdown 排版给一份最小 `.sd-typography` CSS,作为 headless 样式示范。
- 单文件 < 300 行。

## 部署与验证

- 独立 Vercel 项目,root `packages/streamdown/site`,`vite build` 静态产物;
  域名后定。
- 验证:agent-browser 本地过一遍 —— hero 自动播放、playground 各控件生效、
  profiler 指标非零、无 console error。

## 本期不做

竞品对比、多页文档、SEO、i18n、手动主题切换。
