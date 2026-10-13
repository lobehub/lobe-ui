# ADR：base-ui DatePicker 底层方案 —— 继续自研面板 vs @rc-component/picker

- 状态：Accepted —— T-763 评估结论；T-765 已按 §8 第 1–5、7 步落地（第 6 步可选键盘增强层未实现，`index.mdx` 写明与 antd 一致）
- 日期：2026-10-13
- 范围：`src/base-ui/DatePicker`，目标是让接口、能力、demo 与 antd DatePicker 对齐（差距清单见同目录 `ALIGNMENT.md`）
- 约束：可以引入 `@rc-component/picker`；不得引入 `antd` 或其他 antd 组件包
- 本文只做评估，不修改任何源码；原型全部位于临时目录 `/tmp/t763`

## 1. 结论（推荐）

**推荐：rc-picker 方案**。内核改用 `@rc-component/picker@~1.12.2`，与 antd master（6.6.6）使用同一个包、同一个版本范围。弹层使用它自带的 `@rc-component/trigger`，样式用 antd-style 按 `prefixCls = 'lobe-picker'` 编写，输入框外观复用 `base-ui/Input` 的 variant 与 size 样式。迁移完成后删除 `CalendarPanel.tsx`、`calendar.ts` 和 `PickerShell.tsx`。

lobe 当前额外提供的"面板内方向键导航"（antd / rc-picker 均没有，见 §3 第 8 行）不放进内核。它作为**可选的 lobe 增强层**叠加在 rc-picker 之上，通过 `onKeyDown` + 受控 `pickerValue` + `cellRender` 实现，不 fork rc-picker。

不推荐"自研外壳 + rc-picker 的 `PickerPanel`"这类混合方案。rc-picker 的价值主要在 `PickerInput` 层，包括输入解析、mask、范围活动端切换、`needConfirm`、`multiple` 的 tag 选择器和 `onCalendarChange` 时序。只借用面板，最难的部分仍然要自己写，同时还要和 rc 的面板内部状态双向同步。

### 理由摘要

1. **工作量**：在 11 项目标能力中，rc-picker 内置 10 项，只有键盘网格导航不内置（antd 本身也没有）。原型在 React 19.2.7 StrictMode 下实测通过（§4）。自研估算约 26–35 人日，rc-picker 估算约 9–12 人日（§3）。
2. **风险**：高风险集中在 time 列 × needConfirm × RangePicker 活动端切换 × disabledDate/disabledTime 的 `info.from` × 输入解析/mask 的组合。rc-picker 已在 antd 生产环境中处理过这些组合；自研需要逐一推导 antd 语义，回归面大。
3. **行为一致性**：antd DatePicker 的 `picker` / `mode` / `showTime` / `presets` / `multiple` / `needConfirm` / `format` / `cellRender` / `panelRender` / `components` / `disabledDate(current, info)` 等 API **本身就是 rc-picker 的 API**（antd `generatePicker/generateSinglePicker.tsx` 直接 `import RCPicker from '@rc-component/picker'`），可以做到 1:1 语义对齐。
4. **包体积**：rc-picker 及其传递依赖 gzip 后 41.0 KB（dayjs 外部化），dayjs 插件另加约 5.7 KB（§5.2）。`antd@^6` 是本库的 peer，antd 6.6.x 依赖同一个 `@rc-component/picker ~1.12.2` 和 `@rc-component/trigger ^3.10.1`，版本一致时 consumer 侧会去重，增量接近 0。
5. **兼容性**：peer 为 `react >=16.9`（trigger 为 `>=18`）；`es/` 是 ESM，JS 中不 import CSS；仓库 vitest（4.1.11）+ jsdom + StrictMode 实测可用；tsdown 会自动外部化，包括 `/generate/dayjs`、`/locale/*` 子路径（§5）。仓库已有 `@rc-component/table`（Table ADR，`lobe-table` 前缀 + `createStaticStyles`），这是同样做法的先例。

## 2. 包身份与依赖

### 2.1 antd master 用的是哪个包

```
$ curl -s https://raw.githubusercontent.com/ant-design/ant-design/master/package.json -o antd-master-package.json
$ grep -n '"version"\|rc-component/picker\|rc-component/trigger\|"dayjs"\|@rc-component/util' antd-master-package.json
3:  "version": "6.6.6",
140:    "@rc-component/picker": "~1.12.2",
156:    "@rc-component/trigger": "^3.10.1",
158:    "@rc-component/util": "^1.13.0",
160:    "dayjs": "^1.11.11",

$ curl -s .../components/date-picker/generatePicker/generateSinglePicker.tsx | grep -n "from '@rc-component"
3:import RCPicker from '@rc-component/picker';
4:import type { PickerRef } from '@rc-component/picker';
5:import type { GenerateConfig } from '@rc-component/picker/generate/index';
6:import type { PickerMode } from '@rc-component/picker/interface';
7:import { merge } from '@rc-component/util';
$ curl -s .../components/date-picker/index.tsx | grep -n "rc-component"
1:import dayjsGenerateConfig from '@rc-component/picker/generate/dayjs';

$ npm view @rc-component/picker version          # latest
1.15.0
$ for v in 6.1.1 6.5.0 6.6.6; do npm view antd@$v dependencies ...; done
antd@6.1.1: "@rc-component/picker":"~1.9.0", "@rc-component/trigger":"^3.7.1"
antd@6.5.0: "@rc-component/picker":"~1.11.0","@rc-component/trigger":"^3.9.1"
antd@6.6.6: "@rc-component/picker":"~1.12.2","@rc-component/trigger":"^3.10.1"
```

本仓库 devDependency `antd@^6.5.0` 解析到的 pnpm store 中已有同一版本：`node_modules/.pnpm/@rc-component+picker@1.12.2_dayjs@1.11.23_…`、`@rc-component+trigger@3.10.1_…`。

**选定版本：`@rc-component/picker@~1.12.2`**，与 antd master 一致，保证 consumer 去重。1.13–1.15 是 2026-09 的新版本，等 antd 升级后再跟进。旧包名 `rc-picker` 已不再被 antd v6 使用，不考虑。

### 2.2 需新增的依赖

| 包                     | 版本               | 位置           | 说明                                                                                                                                                                            |
| ---------------------- | ------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@rc-component/picker` | `~1.12.2`          | `dependencies` | 唯一需要新增的直接依赖                                                                                                                                                          |
| `dayjs`                | `^1.11.21`（已有） | `dependencies` | 已存在。rc-picker 把 dayjs 声明为**可选 peer**（`>= 1.x`）；`generate/dayjs` 内部 `extend` 了 customParseFormat / advancedFormat / weekday / localeData / weekOfYear / weekYear |

不需要直接依赖 `@rc-component/trigger`，因为弹层参数通过 picker 的 `getPopupContainer` / `placement` / `popupAlign` / `transitionName` 透传。如果实现中要直接 import 传递依赖（例如 `@rc-component/util` 的 `omit`），必须把它显式加入 `dependencies`，以便 tsdown 外部化并避免 phantom dependency。建议优先用仓库已有工具。

不需要移除任何依赖：`@base-ui/react` 仍被其他组件使用，`dayjs` 继续保留。

### 2.3 传递依赖树（无 antd 组件包）

在隔离目录 `/tmp/t763/proto` 中单独安装，只装 `@rc-component/picker@1.12.2` + `dayjs@1.11.21` + React 19.2.7：

```
$ npm ls --all --omit=dev
proto@1.0.0 /tmp/t763/proto
├─┬ @rc-component/picker@1.12.2
│ ├─┬ @rc-component/overflow@1.0.1
│ │ ├── @babel/runtime@7.29.10
│ │ ├── @rc-component/resize-observer@1.1.2 deduped
│ │ ├── @rc-component/util@1.14.0 deduped
│ │ ├── clsx@2.1.1 deduped
│ │ ├── react-dom@19.2.7 deduped
│ │ └── react@19.2.7 deduped
│ ├─┬ @rc-component/resize-observer@1.1.2
│ │ ├── @rc-component/util@1.14.0 deduped
│ │ ├── react-dom@19.2.7 deduped
│ │ └── react@19.2.7 deduped
│ ├─┬ @rc-component/trigger@3.10.1
│ │ ├─┬ @rc-component/motion@1.3.3
│ │ │ ├── @rc-component/util@1.14.0 deduped
│ │ │ ├── clsx@2.1.1 deduped
│ │ │ ├── react-dom@19.2.7 deduped
│ │ │ └── react@19.2.7 deduped
│ │ ├─┬ @rc-component/portal@2.2.1
│ │ │ ├── @rc-component/util@1.14.0 deduped
│ │ │ ├── clsx@2.1.1 deduped
│ │ │ ├── react-dom@19.2.7 deduped
│ │ │ └── react@19.2.7 deduped
│ │ ├── @rc-component/resize-observer@1.1.2 deduped
│ │ ├── @rc-component/util@1.14.0 deduped
│ │ ├── clsx@2.1.1 deduped
│ │ ├── react-dom@19.2.7 deduped
│ │ └── react@19.2.7 deduped
│ ├─┬ @rc-component/util@1.14.0
│ │ ├── is-mobile@5.0.0
│ │ ├── react-dom@19.2.7 deduped
│ │ ├── react-is@19.3.0
│ │ └── react@19.2.7 deduped
│ ├── clsx@2.1.1
│ ├── UNMET OPTIONAL DEPENDENCY date-fns@>= 2.x
│ ├── dayjs@1.11.21 deduped
│ ├── UNMET OPTIONAL DEPENDENCY luxon@>= 3.x
│ ├── UNMET OPTIONAL DEPENDENCY moment@>= 2.x
│ ├── react-dom@19.2.7 deduped
│ └── react@19.2.7 deduped
├── dayjs@1.11.21
├─┬ react-dom@19.2.7 …
└── react@19.2.7

$ npm ls antd --all
proto@1.0.0 /tmp/t763/proto
└── (empty)
exit=1

$ npm ls --all --omit=dev --parseable | grep -E "/(antd|@ant-design)(/|$)"
grep-exit=1 (1 = no match)
```

完整传递依赖：`@rc-component/overflow`、`@rc-component/resize-observer`、`@rc-component/trigger`（含 `@rc-component/motion`、`@rc-component/portal`）、`@rc-component/util`、`clsx`、`is-mobile`、`react-is`、`@babel/runtime`。peer 为 `react` / `react-dom`，可选 peer 为 `dayjs` / `moment` / `luxon` / `date-fns`。`moment` / `luxon` / `date-fns` 只在 `es/generate/{moment,luxon,dateFns}.js` 里 import，入口不会引用它们，所以无需安装。`@rc-component/*` 是 react-component 组织维护的底层无样式组件，不是 antd 组件包。**依赖树中不存在 `antd` 或任何 `@ant-design/*` 包。**

## 3. 能力对比（对齐 antd 所需能力）

工作量为单人估算（人日）。风险指该能力与其他能力组合时出 bug 或行为偏离 antd 的可能性。"现状"指当前自研实现（`CalendarPanel.tsx` 270 行、`calendar.ts` 93 行、`PickerShell.tsx` 88 行、`DatePicker.tsx` 105 行、`DateRangePicker.tsx` 148 行）。"原型"指 §4 的实测结果。

| #        | 能力                                                                                                                                                                  | 现状（自研）                                                                                        | 自研方案：工作量 / 风险                                                                                                                                       | rc-picker 方案：工作量 / 风险                                                                                                                                                                                                                                                                                                                                                                                            |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1        | date / week / month / quarter / year / time 面板，以及 decade 面板                                                                                                    | date / month / year（年视图 12 年一页，非 antd 的 decade 结构）                                     | 3–4d / 中。需新增 week（周号列、`showWeek`、`wo` 格式）、quarter，以及 decade 与 year 的 10 年一页结构                                                        | 0（只写样式）/ 低。原型：`picker=week` 输入值 `2026-42nd`、48 个 cell；`quarter` 为 `2026-Q4`、4 个 cell；`mode="decade"` 渲染 `lobe-picker-decade-panel`                                                                                                                                                                                                                                                                |
| 2        | `showTime` 与时间列（format、use12Hours、steps、hideDisabledOptions、disabledTime、changeOnScroll、`picker="time"`）                                                  | 无                                                                                                  | 4–5d / **高**。需要自写滚动列、对齐选中项、步长、禁用项隐藏、12 小时制，以及时间与日期的合并规则                                                              | 0 / 低。原型：`showTime={{format:'HH:mm'}}` 渲染 2 列、小时列 24 项，有 Now 和 OK                                                                                                                                                                                                                                                                                                                                        |
| 3        | RangePicker 联动与 `disabledDate(current, info)` 的 `info.from` / `info.type`，`onCalendarChange` 的 `info.range`，`allowEmpty`、`order`、`disabled` 元组、活动端切换 | 只支持日期范围，`disabledDate(date)` 单参数，自动排序                                               | 4–6d / **高**。需要实现活动端状态机（先点结束框、Tab 切换端、一端选完自动聚焦另一端）、`info.from`、`allowEmpty`，并在 week/month/quarter/year 上实现范围选择 | 0 / 低。原型：选起点 2026-10-10 后，`disabledDate` 收到 `info.from`（type=`date`），2026-11-09 可选、2026-11-10 起 75 个 cell 被禁用；`onCalendarChange` 依次为 `2026-10-10~\|start`、`2026-10-10~2026-11-05\|end`；`onChange` 为 `["2026-10-10","2026-11-05"]`                                                                                                                                                          |
| 4        | `presets`（单选和范围，值可为函数）                                                                                                                                   | 无                                                                                                  | 1d / 低                                                                                                                                                       | 0 / 低。原型：`value: () => dayjs('2026-10-12')` 点击后 `onChange` 收到 `2026-10-12`                                                                                                                                                                                                                                                                                                                                     |
| 5        | `multiple`（`maxTagCount` 含 responsive、`tagRender`、`removeIcon`）                                                                                                  | 无                                                                                                  | 2–3d / 中。需要 tag 选择器和 responsive overflow（`maxTagCount: 'responsive'` 要测量）                                                                        | 0（只写 tag 样式）/ 低。内置 `@rc-component/overflow`。原型：连点 2 天得到 2 个 tag，**关闭弹层后**才触发 `onChange` `["2026-10-05","2026-10-07"]`，与 antd 一致                                                                                                                                                                                                                                                         |
| 6        | `needConfirm` / OK / `onOk` / `changeOnBlur` / `previewValue`                                                                                                         | 无                                                                                                  | 1.5–2d / 中。和 showTime、范围、blur 的交互时序容易出错                                                                                                       | 0 / 低。原型：`needConfirm` 点日期后 `onChange` 仍为 `null`，点 OK 后变为 `2026-10-05`；showTime 下 OK 前为 `null`，OK 后为 `2026-10-20 09:30`，`onOk` 调用 1 次                                                                                                                                                                                                                                                         |
| 7        | 可输入 input、输入解析、`format` 数组、`format` 函数、`{format, type:'mask'}`                                                                                         | 触发器是 `<button>`，不能输入；`format` 只用于展示                                                  | 3–4d / **高**。需要实现输入框、多格式解析（依赖 customParseFormat）、非法输入回退、`preserveInvalidOnBlur`、mask 的分段编辑和方向键调值                       | 0 / 低。原型：`format=['YYYY-MM-DD','YYYYMMDD','DD/MM/YYYY']` 时键入 `13/10/2026` 回车，`onChange` 收到 `2026-10-13`，input 被格式化为首个格式。mask 的分段编辑在源码 `PickerInput/Selector/Input.js`（Backspace / Arrow / 数字键分支）中，jsdom 原型未复现输入，需要在浏览器中验证（WP-5）                                                                                                                              |
| 8        | 键盘导航                                                                                                                                                              | **有**面板网格导航：方向键、PageUp/PageDown、Home/End、跳过禁用日、打开时聚焦选中日（4 个测试覆盖） | 输入框键盘（Enter 提交、Esc 关闭、Tab 切换范围端）1d / 中；网格导航已有                                                                                       | antd 对齐部分为 0：Enter / Esc 内置，原型中 Esc 后弹层隐藏。**rc-picker 面板 cell 不可聚焦**（原型 `focusableCells: 0`），源码中方向键只出现在 mask 输入分支，**没有网格导航**，antd 同样没有。若要保留 lobe 的网格导航，需要叠加增强层：用 `onKeyDown(e, preventDefault)` 拦截方向键 → 维护 `activeDate` → 用受控 `pickerValue` 翻页 → 用 `cellRender` 加 active class 和 `aria-current` → Enter 提交。估算 1.5–2d / 中 |
| 9        | `cellRender`（`info.originNode/today/range/type/subType/locale`）、`panelRender`、`components`、`prevIcon` 等                                                         | 无                                                                                                  | 1.5–2d / 中。需要把 `info` 各字段补齐到 antd 语义，`components` 的每个面板都要可替换                                                                          | 0 / 低。原型：`cellRender` 替换 42 个 date cell；`panelRender` 包裹层内含 `.lobe-picker-panel`；自定义 `prevIcon` 已渲染                                                                                                                                                                                                                                                                                                 |
| 10       | locale 与 dayjs generateConfig（`PickerLocale`、周起始日、`generatePicker`）                                                                                          | 文案来自 `@/i18n` 的 `datePicker.*`（7 个 key）；周起始日读 `dayjs.Ls`                              | 2d / 中。需要定义 `PickerLocale`，按需 extend dayjs 插件，自己实现 generateConfig 抽象（才能支持 `generatePicker`）                                           | 1d / 低。直接使用 `@rc-component/picker/generate/dayjs` 和 `locale/*`。原型：`zh_CN` + `dayjs.locale('zh-cn')` 时，表头为 `一二三四五六日`，标题为 `2026年10月`。**注意**：rc 的 locale 里没有 placeholder（原型中 `placeholder: null`），antd 的 placeholder 由 antd 层的 `lang.placeholder` 提供，因此需要用 lobe i18n 资源补齐 placeholder、rangePlaceholder 以及各 picker 的变体                                     |
| 11       | 弹层定位（`placement`、`getPopupContainer`、z-index、动画）                                                                                                           | base-ui `Popover`，固定 `bottomLeft`，与 base-ui 浮层树天然嵌套                                     | 0.5d / 低。把 `placement` / `getPopupContainer` 映射到 base-ui Positioner / Portal container                                                                  | 0.5–1d / 中。改用 `@rc-component/trigger`，`placement` 和 `getPopupContainer` 原生支持，原型中 `getPopupContainer` 生效。需要统一 z-index（`base-ui/zIndex`），用 `transitionName` + antd-style keyframes 对齐 `panelStyles.popup` 动效。嵌套场景（§4.3）在 jsdom 中，base-ui Popover / Dialog 内选日期不会关闭宿主；仍建议默认把弹层挂到最近的 base-ui popup 内，并在浏览器中复核                                       |
| —        | 样式                                                                                                                                                                  | antd-style `style.ts` 191 行，作用于自有 DOM                                                        | 随新能力一起写，约 2–3d                                                                                                                                       | 2.5–3.5d / 中。按 rc-picker 的 className 契约用 antd-style 重写，源码中约 50 个 `${prefixCls}-*` 后缀，原型一个 RangePicker+showTime+presets 实例渲染出 42 个                                                                                                                                                                                                                                                            |
| —        | 公共 API 层（Dayjs 类型、wrapper、semantic `classNames/styles`、静态成员）                                                                                            | —                                                                                                   | 2–3d                                                                                                                                                          | 2–3d（两种方案相同，都需要按 ALIGNMENT WP-1/10/11 实现）                                                                                                                                                                                                                                                                                                                                                                 |
| **合计** |                                                                                                                                                                       |                                                                                                     | **≈ 26–35 人日；高风险集中在 2/3/6/7 的组合**                                                                                                                 | **≈ 9–12 人日**（含可选键盘增强层 1.5–2d）；主要风险在样式契约、弹层与 base-ui 浮层共存、Date→Dayjs 破坏性变更                                                                                                                                                                                                                                                                                                           |

## 4. 原型验证（临时目录，不在 src/）

位置：`/tmp/t763/proto`（npm 隔离安装）、`/tmp/t763/scripts/render-picker.jsx`、`/tmp/t763/scripts/nest.jsx`、`/tmp/t763/proto/vt.test.jsx`。脚本经 esbuild 打包，`--main-fields=module,main --conditions=import` 模拟 Vite / webpack 走 `es/` 入口；环境为 React 19.2.7 + jsdom + `createRoot` + `<StrictMode>`，`prefixCls='lobe-picker'`。

### 4.1 `render-picker.jsx` 输出（节选，`/tmp/t763/out/render-picker.json`）

```json
{
  "consoleErrors": ["An update to %s inside a test was not wrapped in act(...) …"],
  "formatArray": { "typed": "13/10/2026", "onChange": "2026-10-13", "inputAfter": "2026-10-13" },
  "inlineStyleOnPopup": "--arrow-x: 0px; --arrow-y: 0px; left: -1000vw; top: -1000vh; right: auto; bottom: auto; box-sizing: border-box;",
  "keyboard": {
    "inputAfterArrows": "2026-10-13",
    "hoverCells": 0,
    "focusableCells": 0,
    "onChangeAfterEnterNoTyping": null,
    "popupHiddenAfterEsc": true
  },
  "locale": { "weekHeader": "一二三四五六日", "header": "2026年10月", "placeholder": null },
  "multiple": {
    "onChangeBeforeClose": null,
    "onChange": ["2026-10-05", "2026-10-07"],
    "tags": ["2026-10-05", "2026-10-07"]
  },
  "needConfirm": { "before": null, "after": "2026-10-05" },
  "panels": {
    "date": { "inputValue": "2026-10-13", "panelClass": "lobe-picker-date-panel", "cells": 42 },
    "week": { "inputValue": "2026-42nd", "panelClass": "lobe-picker-week-panel", "cells": 48 },
    "month": { "inputValue": "2026-10", "panelClass": "lobe-picker-month-panel", "cells": 12 },
    "quarter": { "inputValue": "2026-Q4", "panelClass": "lobe-picker-quarter-panel", "cells": 4 },
    "year": { "inputValue": "2026", "panelClass": "lobe-picker-year-panel", "cells": 12 },
    "time": { "inputValue": "09:30:00", "panelClass": "lobe-picker-time-panel", "cells": 0 },
    "decadeMode": "lobe-picker-decade-panel"
  },
  "presets": { "label": "Yesterday", "onChange": "2026-10-12" },
  "range": {
    "datePanels": 2,
    "disabledInfoFromSeen": true,
    "disabledInfoType": ["date"],
    "cellsDisabledAfterStart": { "count": 75, "first": "2026-11-10", "last": "2027-01-09" },
    "nov9Disabled": false,
    "nov10Disabled": true,
    "calendarChange": ["2026-10-10~|start", "2026-10-10~2026-11-05|end"],
    "onChange": ["2026-10-10", "2026-11-05"]
  },
  "reactVersion": "19.2.7",
  "render": {
    "customCells": 42,
    "panelWrapped": true,
    "popupInsideRoot": true,
    "customPrevIcon": true
  },
  "showTime": {
    "timeColumns": 2,
    "hourCells": 24,
    "hasOk": true,
    "hasNow": true,
    "onChangeBeforeOk": null,
    "onChangeAfterOk": "2026-10-20 09:30",
    "onOkCalls": 1
  }
}
```

console 中没有 React 19 相关告警（无 `findDOMNode`、`element.ref`、`defaultProps` 废弃提示），源码中也没有 `findDOMNode` / `defaultProps`（`grep -rn` 为空）。唯一一条是 trigger 定位的异步 `setState` 落在 `act` 外，属于测试写法问题；在 vitest 中可以用 `await act(...)` / `waitFor` 消除。

className 契约（同一原型，RangePicker + showTime + presets，`$P = lobe-picker`）：`$P`、`$P-range`、`$P-input`、`$P-input-start/end/active`、`$P-active-bar`、`$P-range-separator`、`$P-dropdown`、`$P-dropdown-range`、`$P-dropdown-placement-bottomLeft`、`$P-range-wrapper`、`$P-range-arrow`、`$P-panel-container`、`$P-panel-layout`、`$P-presets`、`$P-panel`、`$P-date-panel`、`$P-datetime-panel`、`$P-header`、`$P-header-view`、`$P-header-(super-)prev/next-btn`、`$P-month-btn`、`$P-year-btn`、`$P-body`、`$P-content`、`$P-cell`、`$P-cell-inner`、`$P-cell-in-view`、`$P-cell-today`、`$P-time-panel`、`$P-time-panel-column`、`$P-time-panel-cell(-inner)`、`$P-footer`、`$P-ranges`、`$P-ok`，共 42 个。弹层只有定位用的 inline style，没有视觉样式。

### 4.2 仓库 vitest 下可运行

```
$ /home/ubuntu/develop/lobe-ui/node_modules/.bin/vitest run --root /tmp/t763/proto
 RUN  v4.1.11 /tmp/t763/proto
 Test Files  1 passed (1)
      Tests  1 passed (1)
```

`vt.test.jsx` 在 jsdom + StrictMode 下渲染 `Picker`（open）和 `RangePicker`，断言 `.lobe-picker-date-panel` 存在，并断言没有 `findDOMNode|element.ref|defaultProps` 告警。需要 stub `ResizeObserver`（与 Table 相同）。

### 4.3 嵌套在 base-ui 浮层中（`nest.jsx`，@base-ui/react 1.8.0）

```json
[
  {
    "kind": "popover",
    "nestPopup": false,
    "rcPopupRendered": true,
    "rcPopupInsideHost": false,
    "hostStillOpen": true,
    "pickerOnChange": "2026-10-05"
  },
  {
    "kind": "popover",
    "nestPopup": true,
    "rcPopupRendered": true,
    "rcPopupInsideHost": true,
    "hostStillOpen": true,
    "pickerOnChange": "2026-10-05"
  },
  {
    "kind": "dialog",
    "nestPopup": false,
    "rcPopupRendered": true,
    "rcPopupInsideHost": false,
    "hostStillOpen": true,
    "pickerOnChange": "2026-10-05"
  },
  {
    "kind": "dialog",
    "nestPopup": true,
    "rcPopupRendered": true,
    "rcPopupInsideHost": true,
    "hostStillOpen": true,
    "pickerOnChange": "2026-10-05"
  }
]
```

在 jsdom 的合成事件下，即使 rc 弹层挂在 `body`，宿主 Popover / Dialog 也不会因为点击 picker 弹层而关闭。但 jsdom 无法完全模拟真实浏览器的 pointer 事件和 focus 行为，因此迁移时仍应**默认将弹层挂到最近的 base-ui popup 内**（`getPopupContainer = trigger => trigger.closest(<base-ui popup 选择器>) ?? document.body`），并在浏览器中复核。

## 5. 兼容性

### 5.1 ESM / React 19

- `peerDependencies`：`react >=16.9.0`、`react-dom >=16.9.0`；`@rc-component/trigger@3.10.1` 为 `>=18.0.0`。满足仓库 `react ^19`。
- 打包形态：有 `exports` 字段（`.`、`./generate/*`、`./locale/*`、`./interface`，`import` → `es/*.js`，`require` → `lib/*.js`，`types` → `es/*.d.ts`），也有 `module: ./es/index`。`es/` 的 JS 中**不 import 任何 `.css/.less`**。外部 import 只有 `react`、`@rc-component/{util,trigger,resize-observer,overflow}`、`clsx`、`dayjs` 及其插件（`moment` / `luxon` / `date-fns` 只出现在对应的 `generate/*` 文件中）。
- **Node 原生 ESM 不可直接加载**：`es/` 内部相对 import 不带扩展名，且包里没有 `"type": "module"`：
  ```
  $ node --input-type=module -e "import('@rc-component/picker')"
  node-esm FAIL ERR_MODULE_NOT_FOUND Cannot find module '.../es/PickerInput/RangePicker'
  $ node -e "require('@rc-component/picker')"
  cjs [ 'Picker', 'PickerPanel', 'RangePicker', 'default' ]
  ```
  Vite、webpack、rolldown 以及 vitest 都能正常处理（vitest 会把这类非合法 Node ESM 的依赖 inline，见 §4.2）。antd 本身同样如此，所以与 antd 用户处境一致。如果 consumer 在纯 Node ESM 的 SSR 环境中不经打包直接 import `@lobehub/ui/es/base-ui/DatePicker`，会遇到同样的问题。这个风险与 antd 相同，在文档中注明即可。
- 源码有 `process.env.NODE_ENV` 引用，由 consumer 的打包器替换，与 antd 相同。

### 5.2 包体积（esbuild `--bundle --minify`，react / react-dom 外部化）

| 入口                                                                                                           | min       | gzip         |
| -------------------------------------------------------------------------------------------------------------- | --------- | ------------ |
| `@rc-component/picker`（Picker + RangePicker + `generate/dayjs`，含全部传递依赖，dayjs 外部化）                | 114,040 B | **41,007 B** |
| 其中 `@rc-component/trigger`（含 motion / portal / resize-observer / util）                                    | 41,779 B  | 16,617 B     |
| 同上，但把 dayjs + 6 个插件也打进来                                                                            | 129,878 B | 46,750 B     |
| 现状自研 `src/base-ui/DatePicker`（含内部 `@/` 依赖：Input 样式、Popover 封装、i18n、Icon；所有 npm 包外部化） | 45,973 B  | 12,694 B     |

自研方案要补齐 §3 中的能力，预计还需增加约 2,000–3,000 行代码，最终体积会接近 rc-picker。**对 consumer 而言**，`antd@^6`（本库 peer，6.6.x 依赖 `@rc-component/picker ~1.12.2` 和 `@rc-component/trigger ^3.10.1`）已带入同一组包，版本对齐时去重后增量约为 0。如果 consumer 锁在较旧的 antd 6.1 / 6.5（picker `~1.9` / `~1.11`），会存在两份 picker，最坏增量约 41 KB gzip。

### 5.3 tsdown 外部化

`tsdown.config.ts` 中 `external = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]`，并启用 `unbundle: true`。在 `/tmp/t763/tsd` 用相同配置和仓库的 tsdown 二进制实测，**子路径也会外部化**，`.d.mts` 正常引用 rc 的类型：

```
$ /home/ubuntu/develop/lobe-ui/node_modules/.bin/tsdown
ℹ es/index.mjs    0.28 kB │ gzip: 0.17 kB
ℹ es/index.d.mts  0.58 kB │ gzip: 0.32 kB
✔ Build complete in 525ms

$ cat es/index.mjs
import Picker from "@rc-component/picker";
import dayjsGenerateConfig from "@rc-component/picker/generate/dayjs";
import enUS from "@rc-component/picker/locale/en_US";
…
$ cat es/index.d.mts
import { PickerProps } from "@rc-component/picker";
import { Dayjs } from "dayjs";
type LobePickerProps = Omit<PickerProps<Dayjs>, 'generateConfig' | 'locale' | 'prefixCls'>;
…  dayjsGenerateConfig: import("@rc-component/picker/generate").GenerateConfig<Dayjs>;
```

把 `@rc-component/picker` 加入 `dependencies` 后无需修改 tsdown 配置。

### 5.4 antd-style 样式方案

rc-picker 没有运行时样式，只输出稳定的 `${prefixCls}-*` className（§4.1），并透传 `className` / `style` / `rootClassName` / `classNames` / `styles` / `prefixCls` / `popupClassName`。方案与 base-ui Table 相同，Table 使用 `PREFIX_CLS = 'lobe-table'` + `createStaticStyles`，已经落地：

- 使用自有前缀 `lobe-picker`。**不要用 `ant-picker`**，以免和同页 antd 的全局 CSS 冲突。
- 在 `style.ts` 中用 `createStaticStyles` 编写 `.lobe-picker` 作用域下的完整样式，以 antd 6.6 `components/date-picker/style/*` 为结构参照（不引入 antd），覆盖 input、range（active-bar、separator）、dropdown、panel-container / layout、presets、header、body / content / cell（in-view、today、selected、range-start/end/in-range/hover、disabled）、week 行、decade、time 列、footer（now / ok / ranges）以及 multiple 的 tag。token 沿用现有 `cssVar`，输入框外观复用 `base-ui/Input` 的 `rootVariants`（variant / size / shadow）。
- 动画：通过 `transitionName='lobe-picker-slide-up'` 由 antd-style 提供 keyframes，视觉与 `panelStyles.popup` 对齐。
- 风险：className 契约属于 rc-picker 的内部约定。缓解办法是用 `~1.12.2` 锁定 minor，升级时以 antd 同版本的 `date-picker/style` 为参照做 diff。

## 6. 对现有公共 API（`type.ts`）的影响

当前 `type.ts` 有 39 行，`index.ts` 通过 `src/base-ui/index.ts` 的 `export * from './DatePicker'` 公开 `DatePicker`、`DateRangePicker`、`DatePickerProps`、`DateRangePickerProps`、`DateRangeValue`、`CalendarMode`。`grep` 结果显示仓库内没有其他源码消费方。

| 现有项                                                                                 | 迁移后                                                                                                                                                                                                                                            | 性质                                                                                       |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 值类型 `Date \| null`（`value` / `defaultValue` / `onChange(date)`）                   | `Dayjs \| null`，`onChange(date, dateString)`，与 antd 一致                                                                                                                                                                                       | **破坏性**（ALIGNMENT D-2 / D-4）。方案选择与此无关：自研如果要对齐 antd，也必须改成 Dayjs |
| `disabledDate?: (date: Date) => boolean`                                               | `(current: Dayjs, info: { type, from? }) => boolean`                                                                                                                                                                                              | **破坏性**（参数类型变更）                                                                 |
| `format?: string \| ((date: Date) => string)`                                          | antd `FormatType \| FormatType[] \| { format, type: 'mask' }`，函数参数改为 `Dayjs`                                                                                                                                                               | 破坏性（函数参数）+ 新增                                                                   |
| `min` / `max: Date`                                                                    | `minDate` / `maxDate: Dayjs`；`min` / `max` 保留为别名，接受 `Dayjs`                                                                                                                                                                              | 新增 + 别名                                                                                |
| `mode?: CalendarMode`（`'date'\|'month'\|'year'`，实际语义是 antd 的 `picker`）        | 新增 `picker`；`mode` 改为 antd 语义（受控面板模式 + `onPanelChange`）                                                                                                                                                                            | **破坏性**（语义变更，D-4）                                                                |
| `allowClear` / `disabled` / `placeholder` / `size` / `variant` / `className` / `style` | 保留，类型扩展（`allowClear` 对象形式、`size` 加 `large`、`variant` 加 `underlined`、范围 `disabled` 元组、`placeholder` 元组）                                                                                                                   | 不变 + 新增                                                                                |
| `shadow`（lobe 独有）                                                                  | 保留                                                                                                                                                                                                                                              | 不变                                                                                       |
| `footer`（仅单选）                                                                     | 保留为 `renderExtraFooter` 的别名，范围也支持                                                                                                                                                                                                     | 不变 + 新增                                                                                |
| `DateRangePicker` / `DateRangePickerProps` / `DateRangeValue`                          | 新增 `DatePicker.RangePicker`；`DateRangePicker` 保留为别名导出；`DateRangeValue` 改为 `[Dayjs \| null, Dayjs \| null]`                                                                                                                           | 别名 + 破坏性（元素类型）                                                                  |
| `CalendarMode`                                                                         | 由 rc 的 `PickerMode` / `PanelMode` 替代，保留 `CalendarMode` 作为 deprecated 别名                                                                                                                                                                | 别名                                                                                       |
| 新增                                                                                   | `showTime`、`presets`、`multiple`、`needConfirm`、`cellRender`、`panelRender`、`components`、`locale`、`open`、`pickerValue`、`placement`、`getPopupContainer`、`status`、`prefix`、`suffixIcon`、`classNames` / `styles` 等（见 ALIGNMENT §1–3） | 新增                                                                                       |

`type.ts` 中的类型以 `Omit<RcPickerProps<Dayjs>, 'generateConfig' \| 'prefixCls' \| ...>` 为基础，叠加 lobe 字段（`shadow`、`variant`、`size`）。`.d.mts` 会引用 `@rc-component/picker` 的类型（已验证可以正确外部化，见 §5.3），consumer 安装本库时会一并安装它。

## 7. 对现有测试（`__tests__` 下 3 个文件，22 个 test）的影响

| 文件                       | 规模                                                                                        | 影响                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `calendar.test.ts`         | 8 个 test：`buildMonthGrid` ×2、`getWeekdayLabels`、bounds ×3、`moveDayFocus`、`orderRange` | **高**。`calendar.ts` 迁移后删除，这些纯函数测试随之删除。如果实现可选的键盘增强层，`moveDayFocus` 的逻辑和测试可以迁移到增强层的 hook 中保留                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `DatePicker.test.tsx`      | 11 个 test                                                                                  | **中高**。断言 `Date` 值的用例（`emits a Date`、`mode="month" emits the first of the month`、`clear emits null`）改为断言 `Dayjs` / dateString，`mode="month"` 改为 `picker="month"`。触发器从 `<button>` 改为 `<input>`，基于 role 的查询需要调整。`footer`、`placeholder`、`min with time` 用例可保留语义。**4 个键盘用例**（arrow keys move focus、opening moves focus to the selected day、PageDown crossing month edge、arrow keys skip disabled days）：如果实现键盘增强层，改写为针对增强层的用例；如果不实现，就删除，并在文档中写明与 antd 一致（无网格键盘导航） |
| `DateRangePicker.test.tsx` | 3 个 test                                                                                   | 中。`renders two months and both placeholders` 和 `clear resets both ends` 改写选择器后保留。`emits an ordered pair even when the end is picked first` 由 rc 的 `order` 行为覆盖，改为点击结束输入框后再选择                                                                                                                                                                                                                                                                                                                                                               |

另外，每补齐一项能力都应新增对应测试（week/quarter、showTime、needConfirm、presets、multiple、format 数组、`info.from`），vitest 中需要 stub `ResizeObserver`。这属于下游实现任务。

## 8. 迁移步骤

1. **依赖**：`pnpm add @rc-component/picker@~1.12.2`（`dayjs` 已在 `dependencies` 中）。确认 `pnpm why antd` 中没有新增 antd 包，并确认 `es/` 产物保留外部 `import '@rc-component/picker…'`。
2. **内核封装**：新建内部 `generateConfig.ts`（re-export `@rc-component/picker/generate/dayjs`）和 `locale.ts`（基于 `@rc-component/picker/locale/*`，再用 `@/i18n` 的 `datePicker.*` 补齐 placeholder、rangePlaceholder、各 picker 变体和 today/now/ok 文案。i18n key 扩展属于 WP-9）。
3. **样式先行**：在 `style.ts` 中按 `PREFIX_CLS = 'lobe-picker'` 用 `createStaticStyles` 重写 rc-picker className 契约（§5.4），输入框外观复用 `base-ui/Input` 的 `rootVariants`，弹层视觉对齐 `panelStyles.popup`，并补 `lobe-picker-slide-up` 动画。
4. **组件替换**：`DatePicker.tsx` 改为渲染 `<RcPicker prefixCls generateConfig locale … />`，`DateRangePicker.tsx` 改为渲染 `<RcRangePicker … />`；注入 `suffixIcon`、`clearIcon`、`prevIcon` 等 lucide 图标；默认 `getPopupContainer` 挂到最近的 base-ui popup；统一 z-index。删除 `CalendarPanel.tsx`、`calendar.ts`、`PickerShell.tsx`。
5. **类型**：按 §6 重写 `type.ts`（以 rc 的 props 为基础，叠加 lobe 字段），在 `index.ts` 导出 antd 风格类型别名，保留 `DateRangePicker` 与 `CalendarMode` 的兼容别名，挂载 `DatePicker.RangePicker` 等静态成员（WP-11）。
6. **可选键盘增强层**：如果决定保留 lobe 的网格导航，实现 `useGridKeyboard`，内容为 `onKeyDown` 拦截、`activeDate` 状态、受控 `pickerValue` 和 `cellRender` 标记，并把 `moveDayFocus` 及其测试迁移过去。如果不保留，就在文档中写明与 antd 一致。
7. **测试**：按 §7 改写 `DatePicker.test.tsx` 和 `DateRangePicker.test.tsx`，删除 `calendar.test.ts`（或迁移到第 6 步），stub `ResizeObserver`，然后运行 `pnpm vitest run src/base-ui/DatePicker`。
8. **浏览器复核**（`local-testing` skill）：检查 mask 输入、DatePicker 在 base-ui Modal / Popover 中的嵌套（点击弹层不关闭宿主、焦点不被 trap 抢走）、z-index、暗色主题、RTL。
9. **收尾**：运行 `pnpm lint:circular`、scoped lint / type-check 和 `pnpm build`；检查 `es/base-ui/DatePicker/*.mjs` 中的外部 import；在 `index.mdx` 写明 Date → Dayjs 的迁移说明（D-4）。
10. **版本策略**：`@rc-component/picker` 用 `~` 锁定 minor，随 antd 升级同步提升，每次升级都 diff rc-picker 的 className 与 antd 的 `date-picker/style`。

## 9. 何时应重新评估

- antd 更换 DatePicker 底层，或 `@rc-component/picker` 停止维护；
- 浏览器复核发现 `@rc-component/trigger` 与 base-ui 浮层（焦点陷阱、outside press、滚动锁）存在无法用 `getPopupContainer` 解决的冲突。这时可以评估"rc `PickerPanel` + base-ui Popover"的混合方案，代价是自写 `PickerInput` 层（§3 中第 3、5、6、7 行约 10–15 人日）；
- 产品要求面板网格导航成为一等能力（完整 ARIA grid 语义），并且增强层无法满足。
