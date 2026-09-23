---
name: building-with-lobe-ui
description: >
  Build UI with the LobeHub design ecosystem — @lobehub/ui (plus its base-ui, chat, mobile,
  awesome, brand, mdx, i18n namespaces), @lobehub/icons, @lobehub/charts, @lobehub/fluent-emoji
  and @lobehub/streamdown. Covers provider setup, component selection and semantics, design
  tokens via cssVar, craft rules against AI-generated blandness, and a six-dimension acceptance
  check. Trigger on lobe-ui, lobehub, LobeChat UI, AIGC app UI, build a page / component /
  chat interface / dashboard with lobe-ui, pick a lobe-ui component, lobe-ui theme or tokens,
  组件选择, 设计准则.
---

# 用 lobe-ui 构建界面

这份 skill 让「用 lobe-ui 写界面」从碰运气变成可控：把组件语义、视觉取值、工艺标准和验收机制显式化，在生成的每一步介入，而不是在最后靠一条 prompt 补救。

模型见过的界面远多于任何设计师，问题不是能力不够，而是需求含糊时它会收敛到训练数据里最高频、最稳妥的那一类结果——统一无衬线字体、紫蓝渐变、四平八稳的等大卡片。通用、安全，而这正是平庸的根源。下面每一步都在对抗这个倾向。

## 与其他 skill 的分工

| 关注                                 | 归属                                  |
| ------------------------------------ | ------------------------------------- |
| 这个界面该是什么、为什么             | 上游的产品设计判断，不在本 skill 范围 |
| 用哪个组件、取哪个 token、算不算合格 | **本 skill**                          |
| 浏览器里真实跑起来的证据             | 本仓库的 `local-testing` skill        |

## 选最小运行模式

不要每次都把六份文件全读一遍。先定这次要交付什么：

| 模式       | 终点                             | 需要读                                                 |
| ---------- | -------------------------------- | ------------------------------------------------------ |
| **选组件** | 回答「这个信息该用哪个组件」     | 硬性前提 + [components.md](references/components.md)   |
| **取值**   | 写出一段符合系统的 `style.ts`    | 硬性前提 + [design.md](references/design.md)           |
| **建界面** | 一个完整页面或组件，含非理想状态 | 全流程五步 + 全部 references                           |
| **审查**   | 判断已有界面能不能放行           | [evaluator.md](references/evaluator.md) + 被命中的规则 |

窄问题只读相关那一份，并说明检查范围。

## 硬性前提：搞对这三件事，否则全是白工

**一、`@lobehub/ui/base-ui` 是当前的规范命名空间。** 顶层的 `Button`、`Modal`、`Select`、`Tabs`、`Text`、`Tag`、`Avatar`、`ActionIcon`、`Segmented`、`Skeleton`、`Dropdown` 等 27 个经典组件已标记 `@deprecated`，它们是 antd 包装层。新代码一律从 `@lobehub/ui/base-ui` 导入，`@lobehub/ui/eslint` 会强制这条规则。完整清单见 [components.md](references/components.md) 的 C-01。

**二、样式只写 `createStaticStyles` + `cssVar`。** `createStyles` 已被 eslint 禁用。仓库里约 170 个 `style.ts` 全部是这个写法，零例外：

```ts
import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  root: css`
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};

    ${responsive.sm} {
      padding-inline: 12px;
    }
  `,
}));
```

用 `cssVar` 写的样式天然支持暗色模式，不需要任何分支。

**三、Provider 顺序不能颠倒，motion 必须显式传入。**

```tsx
import { ConfigProvider, ThemeProvider } from '@lobehub/ui';
import { zhCn } from '@lobehub/ui/i18n';
import { motion } from 'motion/react';

<ConfigProvider locale="zh-CN" motion={motion} resources={zhCn}>
  <ThemeProvider>
    <App />
  </ThemeProvider>
</ConfigProvider>;
```

`ConfigProvider` 必须在外层：`ThemeProvider` 渲染 antd 的 `App`（承载静态 `notification` / `modal` 持有者）并读取 CDN 配置加载 webfont，两者都依赖上方的 context。

三个容易踩的点：

- `motion` 是必填的。不传会让任何用到动画的组件在 `useMotionComponent()` 处直接抛错。用 `LazyMotion` 的应用传 `m` 而不是 `motion`。
- 组件内部文案（聊天操作、表单、EmojiPicker 等）由 `resources` 提供，可选 `en` 或 `zhCn`。**不要再套一层 `I18nProvider`**——它本身就是 `ConfigProvider` 的转发（同样要求 `motion`），嵌套等于装了两个 provider。
- `ConfigProvider` 会为整个文档安装全局键盘焦点环，包括原生控件和 provider 子树之外的控件。所以正常情况下不需要自己写焦点样式，也绝不能用 `outline: none` 抹掉它。

## 五步链路

不要一上手就画界面。每一步以上一步的产出为前提，上游偏差会沿链路放大，所以约束要尽早进入、每步都检查。

### 1. 规划 —— 先把模糊需求变成可执行的功能定义

在写任何 JSX 之前，把需求展开成六层。写不出来的部分就是需要向用户确认的部分。

```
L1 定位与意图   一句话定义 · 目标用户 · 场景清单 · 非目标 · 行为边界
L2 信息架构     空间区域 · 区域边界规则 · 内容生长规则
L3 核心链路     状态清单 · 主链路 · 分支链路
L4 组件功能     组件定位 · 功能清单 · 默认/悬停/加载/禁用/错误各态
L5 边界条件     空态 · 加载态 · 错误态 · 权限降级
L6 验收标准     Given/When/Then · 完成的定义
```

最容易被跳过的是 L5 和 L6。模型倾向于优先完成主流程和成功态，因为那最像一张完整截图；但真实产品里用户更常遇到加载中、无数据、无权限、失败后重试。**L5 没写，页面就会在关键时刻失去可操作性。**

同时定视觉方向。如果不定，模型会先用默认视觉补位，再把这些默认选择带进后面的结构和组件里。

### 2. 搭骨架 —— 决定信息以什么空间结构铺开

先判断这是哪类页面，再选骨架，不要从空白页拼组件：

| 场景                  | 起点                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------- |
| 文档 / 应用页面外壳   | `Layout` + `LayoutHeader` / `LayoutSidebar` / `LayoutMain` / `LayoutToc` / `LayoutFooter` |
| 对话界面              | `ChatHeader` → `ChatList` → `ChatInputArea`（组合顺序见 C-04）                            |
| 移动端外壳            | `@lobehub/ui/mobile` 的 `ChatHeader` / `ChatInputArea` / `TabBar` / `SafeArea`            |
| 固定窄导航栏          | `SideNav`；需要可拖拽伸缩用 `DraggableSideNav`                                            |
| 可伸缩侧栏 / 浮动面板 | `base-ui` 的 `DraggablePanel`                                                             |
| 营销落地页            | `@lobehub/ui/awesome` 的 `Hero` / `Features` / `GridShowcase`                             |

骨架决定主区、侧栏、操作区、状态区的关系。**这一步错了整个页面都偏**——一个列表页被做成卡片墙、一个批量任务页没有批量操作区，后面怎么改组件都救不回来。

顺带定密度：落地页和控制台不能用同一种密度（见 [craft.md](references/craft.md) 的 K-09）。

### 3. 填充 —— 把信息映射到正确的组件语义

不是把槽位填满。「运行中」「高危」「ECS」「生产环境」都是短文本，但责任不同：一个是状态、一个是风险、一个是资源类型、一个是业务分类。全做成同一种标签，视觉上整齐，语义被抹平，用户的判断会变慢。

先判断这段信息表达状态、分类、动作、容器还是导航关系，再选组件。详见 **[components.md](references/components.md)** ——按需求查的决策表、易混组件的真实差别、以及这个库里没有的组件该去哪里拿。

### 4. 细化 —— 补齐状态、反馈与工艺

主流程能跑只说明能展示成功结果。这一步处理非理想状态和视觉工艺：

- 视觉取值、token 派生、暗色模式、执行约束 → **[design.md](references/design.md)**
- 加载分档、动效目的、可访问性底线、反 AI 味 → **[craft.md](references/craft.md)**
- 图表、模型徽标、emoji、流式 markdown → **[ecosystem.md](references/ecosystem.md)**

### 5. 评估 —— 拿回标准里检查

不要自己说「差不多可以了」。按六个维度逐项对照，命中阻断项就回流。见 **[evaluator.md](references/evaluator.md)**。

浏览器证据不可省略：DOM 里存在不等于用户看得到。本仓库的 `local-testing` skill 定义了完整的验证流程。

## 回流：问题要定位到具体规则

发现问题时不要在最外层改 prompt 然后等下一次结果。按下表定位到环节和规则编号：

| 症状                            | 回到哪一步     | 规则                                           |
| ------------------------------- | -------------- | ---------------------------------------------- |
| 空态 / 加载 / 错误 / 权限态缺失 | 规划的 L5      | [craft.md](references/craft.md) K-05           |
| 页面结构像卡片墙，不像看板      | 搭骨架         | 本文第 2 步 + K-09                             |
| 组件外观像但语义用错            | 填充           | [components.md](references/components.md) C-03 |
| 用了已废弃的顶层组件            | 填充           | [components.md](references/components.md) C-01 |
| 裸 hex、裸 rgba                 | 细化的视觉取值 | [design.md](references/design.md) D-01 / D-10  |
| 状态色是新造的                  | 细化的视觉取值 | [design.md](references/design.md) D-03         |
| 一眼是 AI 模板                  | 细化的工艺     | [craft.md](references/craft.md) K-01           |
| 落地页效果被搬进控制台          | 填充           | [components.md](references/components.md) C-06 |
| 图表颜色与主题脱节              | 填充的生态选型 | [ecosystem.md](references/ecosystem.md) E-02   |
| 说不清哪里不对                  | 评估           | [evaluator.md](references/evaluator.md)        |

## Anti-patterns

- 从 `antd` 直接导入 `Button` / `Select` / `Modal` 等有 base-ui 对应实现的组件，或用 antd 的 `message` / `notification` 而不是 base-ui 的 `toast`。
- 凭直觉在顶层和 `base-ui` 之间二选一。顶层的同名组件大多是 deprecated 的 antd 包装层。
- 把示例和模板当抄板。骨架是起点，业务字段、内容密度、状态清单都要按真实需求调。
- 在需要 `cssVar` 的地方写死值。找不到对应 token 时明示缺口（[design.md](references/design.md) 的 D-11），不要悄悄写一个 hex 绕过系统。
- 为了一个图表引第二个图表库，或为了一个模型徽标去抓远程 SVG。
- 只交截图就宣布完成。没有运行证据的「验证」不成立。
- 把 `lint` / `type-check` / 单测通过当成验收项。它们是前置条件，不是交付证据。

## Reference map

按运行模式加载，不要一次全读：

| 需要                                           | 文件                                           |
| ---------------------------------------------- | ---------------------------------------------- |
| 组件选择决策表、易混组件对照、对话界面组合     | [components.md](references/components.md) `C-` |
| token 取值、状态色派生、暗色模式、执行约束     | [design.md](references/design.md) `D-`         |
| 工艺规则、AI Slop 反模式、可访问性、编码陷阱   | [craft.md](references/craft.md) `K-`           |
| 图表 / 模型徽标 / emoji / 流式 markdown 的 API | [ecosystem.md](references/ecosystem.md) `E-`   |
| 六维度评分、阻断项、证据要求、放行策略         | [evaluator.md](references/evaluator.md)        |
