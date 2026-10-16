# v6 迁移复盘：codemod 之外的成本

日期：2026-10-16

反馈来源：foundry 和四个 admin 的升级 agent，由用户汇总。下游现象、17 个测试用例及成本排序来自这份反馈，本次没有进入下游仓库复跑，也没有耗时或 token 用量统计。仓库现状按本地 `@lobehub/ui` 6.0.1 源码、changelog 和 #731 提交核对，不代表已验证 npm 镜像同步或下游安装结果。

关联：[迁移工具设计](./2026-10-12-v6-migration-kit-design.md)、[迁移指南](../../migration-v6.mdx)。

## 最贵的是静默失效和验证

codemod 能搬 imports，但升级成本还包括找出没有报错的变化、改测试，以及证明页面和交互没有坏。type-check 通过、codemod 不再改文件，都不足以说明迁移完成。

反馈里最烧 token 的三件事：

- 亮色 / 暗色 × 桌面 / 手机的视觉回归截图。
- 全仓 grep 失效的选择器和变量，逐个找 slot 或 token 替代。
- 区分测试是被 v6 升级打挂，还是升级前就挂。

后续优先减少重复排查和无效验证。截图检查仍要保留。

## 下游实际卡在哪里

### 静默失效

- 业务里的 `.ant-*` 选择器和 `--ant-*` 变量在新组件上失效，不会产生类型错误。只能全仓搜，再用截图对比找漏项。
- 暗色分割线、容器底色异常，有些根子在项目自己的色阶和覆盖。只换变量前缀不能证明视觉语义仍然正确，codemod 也判断不了。

### API 和组件缺口

- `Menu` 移除，反馈中的场景最后手改成 `List`。替代取决于菜单用途，不能对所有 `Menu` 一律改名。
- `Select`、`InputNumber`、`Tag`、`Drawer` 的 props 变化，codemod 只提示检查，具体迁移还要手改。
- 6.0.0 的中性色依赖内置预设，自定义 hex 要到 6.0.1 才有支持。
- `Switch` 丢 `aria-label`；`InputPassword` 的显示 / 隐藏密码切换标签固定英文，不能自定义。
- React 19 下 `Tooltip` / `Popover` 报 `element.ref` 警告，调用栈在 lobe-ui 内部，下游仍花时间排查自己的代码。
- `Segmented`、`RangePicker` 的 `styles` slot 缺少可发现的说明，下游以为不支持。

### 测试：手改量最大

- 单独渲染 `Button` / `Drawer` 的测试需要补带 `motion` 的 `MotionProvider`，或复用应用的 `ConfigProvider`。
- 整包 mock `@lobehub/ui` 后缺少 `createStaticStyles`、`Text` 等导出；生产代码的 imports 改完，测试替身仍然不完整。
- `InputNumber` 多了 hidden input，按 DOM 顺序抓 input 的取值断言会选错节点。当前库内测试使用 `getByRole('textbox')` 定位可见输入框。
- lobe-admin 一个仓库就反馈了 17 个被 v6 打挂的用例。这是该仓库的反馈数，不是五个项目的总数。

### 环境

- 刚发版时镜像尚未同步，安装返回 404。
- pnpm 的 `minimumReleaseAge` 拦住新版本安装。
- Vite 旧缓存导致白屏，容易被误判成迁移代码问题。

这三类问题要在安装和启动阶段单独排查，避免让后续代码修复背锅。

## 复盘初次核对：本地 6.0.1 的状态

| 问题                              | 本地核对结果                                                                                                                                                                     | 后续还缺什么                                                                                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 自定义中性色                      | #731 已加入 hex 和注册色阶支持，见 [customNeutral.ts](../../../src/styles/theme/customNeutral.ts) 和 [scope.tsx](../../../src/styles/theme/scope.tsx)                            | 在迁移指南注明最低修复版本，并指导下游复验临时色彩覆盖                                                                                           |
| React 19 `element.ref` 警告       | #731 已统一用 [getElementRef](../../../src/utils/getElementRef.ts) 读取 ref，已有 [回归测试](../../../src/hooks/reactWarnings.test.tsx)                                          | 发版说明写清下游症状和修复版本，避免下游继续补库内问题                                                                                           |
| `Segmented` / `RangePicker` slots | #731 已补 [Segmented 说明和 demo](../../../src/Segmented/index.mdx)、[DatePicker 范围输入框说明](../../../src/DatePicker/index.mdx)，并修正 Segmented 的 `list` slot 应用        | 从迁移报告和指南直接链接到具体 slot，而不只链接组件首页                                                                                          |
| `.ant-*` / `--ant-*` 检查         | [R9](../../../packages/codemod/src/rules/v6/antClassNames.ts) 已有检测，但只检查 JS/TS 字符串和模板；[文件收集器](../../../packages/codemod/src/files.ts) 不收 CSS / Less / Sass | 扩大扫描面，输出命中的具体选择器 / 变量及对应替代                                                                                                |
| props 迁移                        | [R5](../../../packages/codemod/src/rules/v6/changedComponents.ts) 主要按组件 import 给通用提示；原设计明确把 props 自动迁移排除在范围外                                          | 重新划定边界，把确定且保留语义的改写纳入 codemod                                                                                                 |
| 人工处理清单                      | CLI 已支持 `--report <file>` 的 Markdown checklist 和 `--json`                                                                                                                   | 增强覆盖和可执行性；[format.ts](../../../packages/codemod/src/format.ts) 的分组表漏了 R12，文本 / Markdown 不会列出日期组件诊断，JSON 仍保留该项 |
| `Switch` / `InputPassword`        | [Switch](../../../src/Switch/Switch.tsx) 未透传其余原生属性；[InputPassword](../../../src/Input/InputPassword.tsx) 的切换标签仍是英文常量                                        | 修复属性透传和文案配置，补行为回归测试                                                                                                           |
| 测试迁移 / 安装排障               | [迁移指南](../../migration-v6.mdx) 尚无测试迁移专节，升级步骤仍使用 `@beta`                                                                                                      | 同步指南、codemod README 和迁移 skill 的稳定版流程                                                                                               |

上表只确认源码和文档状态；已有测试文件不等于本次执行过测试。

## 接下来最能省成本的几件事

### P0：让静默失效进入报告，并给到具体替代

- 扫描业务 JS/TS 及 CSS / Less / Sass 中的 `.ant-*`、`--ant-*`，报告保留文件、行号和具体命中项。
- 已确认有对应 token 的变量，给出准确的 `cssVar` / `--lobe-*` 名称；组件选择器给出具体 `classNames` / `styles` slot 或 `data-*` 用法。
- 没有一一对应关系的项写清原因和人工检查点，尤其是项目自建色阶、暗色分割线和底色。不能全量替换前缀后宣称完成。
- 修复 R12 格式化漏项，保证文本、Markdown、JSON 报告都能看到需要处理的诊断。

验收看真实行为：样例中的失效选择器和变量能被找到，替代方案可定位；日期 props 的诊断不会在输出清单时丢失。

### P0：补测试迁移专节和可复用 wrapper

- 给出 `MotionProvider` / `ConfigProvider` 包装示例；评估从独立测试入口导出 wrapper，避免每个下游重复维护。
- 整包 mock 改为保留真实模块导出、只覆盖必要成员的 partial mock，覆盖 `createStaticStyles`、`Text` 缺失的场景。
- 用 role、accessible name 定位控件，解释 `InputNumber` 可见输入框与 hidden input 的区别。
- 升级前保存同一批测试的基线；升级后记录新增失败和原有失败，附失败用例和原因。

验收用例覆盖独立渲染 `Button` / `Drawer`、partial mock、`InputNumber` 取值。不能靠跳过失败用例完成迁移。

### P1：能确定的 props 自动改，剩余项说明白

- 从反馈最多的 `Select`、`InputNumber`、`Tag`、`Drawer` 开始，按具体 prop 判断能否安全转换，不再只对整个组件报警。
- 静态值且语义确定的改写自动完成；动态 spread、回调参数变化和缺少对应行为的项留给人工，并给出原因和例子。
- `Menu` 根据用途引导到 `List`、`DropdownMenu`、`ContextMenuTrigger` 或导航组件，报告要覆盖反馈中使用的 `List` 路径。
- 清单区分已自动修改、需要人工修改、需要运行时 / 视觉验证，并列出解析失败或未覆盖的文件类型，避免把“没扫到”理解为“没有问题”。

### P1：发版说明按下游症状写

固定写出「下游症状 → 修复版本 → 可以复验后删除的临时覆盖」。例如：

| 下游症状                                           | 修复版本                                 | 临时覆盖如何处理                                                                                       |
| -------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 自定义 neutral hex 没生效                          | 6.0.1                                    | 接回官方主题入口并检查亮暗色后，删除仅为弥补缺失支持而注入的主题变量；项目自己的色阶仍需保留或显式注册 |
| Tooltip / Popover 出现 React 19 `element.ref` 警告 | 6.0.1                                    | 验证警告消失且 ref 正常后，删除仅针对此问题的库补丁或告警屏蔽                                          |
| 找不到 Segmented / RangePicker 的样式入口          | 6.0.1 已补相关文档和 Segmented slot 修正 | 按文档迁移到 slot 并复验后，删除对应 DOM 选择器覆盖                                                    |

没有发布依据的问题不填猜测版本，也不建议下游批量删掉所有覆盖。

### P1：升级命令固定官方 registry，并校验版本

- 安装命令显式指定 `https://registry.npmjs.org`，使用已确认的稳定版本；codemod 也固定可复现的版本。
- 安装后校验每个实际消费包解析到的 `@lobehub/ui` 版本，不能只看 `package.json` 中的范围；monorepo 要检查各消费 workspace。
- 将镜像同步、`minimumReleaseAge`、Vite 缓存列为三个独立排障项。需要例外时限定到已确认的包和版本，不要求全局关闭保护。
- 同步修改人类指南、codemod README 和迁移 skill，避免 stable 已发布但默认流程还停在 beta。

## 下一次迁移的完成标准

自动改写没有剩余 diff；人工清单每项有处理结论；类型检查和相关测试通过；原有测试失败有基线证据；亮暗 × 桌面手机的关键页面和交互完成验证；已修复问题对应的临时覆盖经过复验和清理。

本次仅记录复盘和后续验收范围，不代表上面的待办已经实现。

## 后续进度：codemod 检测和提示增强

同日按这份复盘补充，以下是工作区实现，尚未发布：

- R9 扩展到 CSS / Less / Sass，已知选择器和变量给出具体 slot / token；未知映射、动态名称明确提示人工检查。样式文件只检测，不自动改写。
- R5 给 Select、InputNumber、Tag、Drawer 的常见旧 props 和 spread 提供逐项指引；Menu 的替代说明补上 List 路径。
- R12 的文本 / Markdown 漏项已修复；新增 R13 检测可能丢失真实导出的整包 mock。
- 文本、Markdown 和 JSON 始终输出后续事项，覆盖测试、亮暗 × 桌面手机、可访问性、版本和安装排障。零静态命中仍要完成这些检查。
- 迁移指南、codemod README 和 skill 同步，补充本地测试 wrapper、partial mock 和 InputNumber 查询示例。

尚未增加组件 props 自动改写或公开 test wrapper 导出，也没有修改 Switch / InputPassword 组件实现；业务色阶和真实页面仍需下游验证。
