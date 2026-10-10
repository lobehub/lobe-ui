# components.md — 组件选择

物料清单只说「有什么」。这份文件说「什么时候该用，什么时候不该用」。

同一个组件外观看起来相似，语义可能完全不同。选之前先判断这段信息表达的是**状态、分类、动作、容器还是导航关系**。

规则可被 [evaluator.md](evaluator.md) 按编号引用。

## C-01 base-ui 优先（硬性规则）

`@lobehub/ui` 是当前的规范命名空间，基于 `@base-ui/react`。顶层的同名组件是早期的 antd 包装层。`@lobehub/ui/eslint` 会直接报错，不要靠记忆二选一。

**这些顶层导出不要用，改从 `@lobehub/ui` 导入：**

```
Accordion · AccordionItem · ActionIcon · Alert · AutoComplete · Avatar · AvatarGroup
Burger · Button · Checkbox · CheckboxGroup · Collapse · DatePicker
DraggablePanel · DraggablePanelBody · DraggablePanelContainer · DraggablePanelFooter · DraggablePanelHeader
Drawer · Dropdown · Input · InputNumber · InputOPT · InputPassword
Modal · ModalHost · Radio · RadioGroup · Segmented · Select
Skeleton · SkeletonAvatar · SkeletonBlock · SkeletonButton · SkeletonParagraph · SkeletonTags · SkeletonTitle
Slider · SliderWithInput · Switch · Tabs · Tag · Text · TextArea · Tree
```

`Collapse` 对应 `Accordion`（多节）或 `Collapsible`（单区域）。`Dropdown` 对应 `DropdownMenu`。`InputOPT` 是旧导出名，组件叫 `InputOTP`。

**这些 antd 导入同样禁掉**，对应实现已经在 `base-ui`（或下面注明的位置）：

```
Anchor · Badge · Breadcrumb · Card · Carousel · ColorPicker · Descriptions · Divider
Empty · FloatButton · List · Menu · Pagination · Popover · Progress · QRCode · Rate
Result · Spin · Statistic · Steps · Table · Tooltip · Typography · Upload
```

外加三条不是组件对组件的禁令：

- antd 的 `message` / `notification` → base-ui 的 `toast`。
- `@ant-design/icons` 的 `LoadingOutlined`、以及整个 `thinking-orbs` 包 → `Spin`（AI 等待用 `variant="network"`）。
- `@ant-design/pro-components` → base-ui 的 `Table`。

`Card` 没有同名组件，用顶层 `Block`，控制台面板用 dashboard 的 `Surface`。`Typography` 用 base-ui 的 `Text`。`FloatButton` 没有对应件，用定位过的 `ActionIcon` 或 `Button`。antd 的 `Menu` 不要用；常驻导航用顶层 `Menu`，控制台侧栏用 `ConsoleNav`。

在消费方项目里接上配套 eslint 就能拦住这些误用：

```js
import restrictedImports from '@lobehub/ui/eslint';
```

**表单是单独入口。** `Form`、`FormModal`、`FormItem` 等从 `@lobehub/ui` 或 antd 导入都会被禁。`base-ui` 桶里再导出的那份 `Form` 也已 `@deprecated`，下个大版本删除。见 C-02。

**等价导入：** `Popover`、`Toast`、`Tooltip`、`ScrollArea`、`DropdownMenu`、`ContextMenu` 在顶层和 `base-ui` 都能导入，指向同一份实现。统一从 `base-ui` 导入更一致。`Empty` 只在顶层，antd 的 `Empty` 不能用。

## C-02 按需求查

### 表单与输入

| 需要                                 | 用                                                                       | 来源               |
| ------------------------------------ | ------------------------------------------------------------------------ | ------------------ |
| 文本 / 多行 / 数字 / 密码 / 验证码   | `Input` · `TextArea` · `InputNumber` · `InputPassword` · `InputOTP`      | `base-ui`          |
| 从固定选项里选                       | `Select`                                                                 | `base-ui`          |
| 自由输入 + 建议                      | `AutoComplete`                                                           | `base-ui`          |
| 开关（立即生效的设置）               | `Switch`                                                                 | `base-ui`          |
| 勾选 / 单选                          | `Checkbox` · `CheckboxGroup` · `Radio` · `RadioGroup`                    | `base-ui`          |
| 区间取值                             | `Slider`，要配数字输入用 `SliderWithInput`                               | `base-ui`          |
| 结构化表单骨架                       | `Form` + `useForm` + `Form.Field` / `.Group` / `.List` / `.SubmitFooter` | `@lobehub/ui/form` |
| 日期 / 月份 / 年份 / 范围            | `DatePicker`（值为原生 `Date`）                                          | `base-ui`          |
| 点击就地改文字                       | `EditableText`                                                           | 顶层               |
| 录制键盘快捷键                       | `HotkeyInput`                                                            | 顶层               |
| 搜索框（带 spotlight 和 `mod+k`）    | `SearchBar`                                                              | 顶层               |
| 从一组预设色里点选                   | `ColorSwatches`                                                          | 顶层               |
| 拾取任意 hex（饱和度 / 色相 / 吸管） | `ColorPicker`（`onChange` 拖动中，`onChangeComplete` 落笔）              | `base-ui`          |
| 选头像 / emoji                       | `EmojiPicker`                                                            | 顶层               |
| 选文件 / 拖拽上传                    | `Upload`（`dragger` 时根节点是 `div`）                                   | `base-ui`          |

表单从自己的入口导入，这样没有表单的页面不会带上表单引擎：

```tsx
import { Form, useForm, useWatch } from '@lobehub/ui/form';

const form = useForm<Values>({ schema, initialValues, onSubmit });

<Form form={form} layout="vertical">
  <Form.Field name="email" label="Email" required>
    <Input />
  </Form.Field>
</Form>;
```

- schema 和 `validate` 放在模块作用域（或 `useMemo`）。写在渲染里会被 `@lobehub/ui/eslint` 的 `no-inline-form-schema` 警告，而且每次渲染都会重建。
- `useForm({ schema })` 只读一次 schema；要换用 `form.setSchema(next)`。
- `items` 数组同样放在组件外或 `useMemo` 里，否则父组件一次渲染会带动每个字段壳。
- 改一个字段只重渲染该字段和 `useWatch` 它的组件。`onValuesChange` 只对用户编辑触发；代码写入要算作用户编辑时传 `{ asUser: true }`。
- 弹层里的表单就是 `Modal` 包一层 `Form`，不要用已废弃的 `FormModal`。

### 反馈与状态

| 需要                    | 用                                                                         | 注意                                                        |
| ----------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 一闪而过的操作结果      | `toast()`（`base-ui`，命令式）                                             | 需在应用里渲染一次 `ToastHost`                              |
| 常驻的行内提示 / 横幅   | `Alert`（`base-ui`，`variant`: `soft`/`outlined`/`plain`）                 | 不要用 Alert 做瞬时反馈                                     |
| 内容加载中的占位        | `Skeleton` + `Skeleton.Avatar` / `Skeleton.Text`（`base-ui`）              | 形状要贴近真实内容；布局已知时用它                          |
| 按钮或图标动作进行中    | `Button` / `ActionIcon` 的 `loading`                                       | 不要再套一个 Spin                                           |
| 行内同步、遮住现有内容  | `Spin`（`base-ui`，`size`: `small`/`middle`/`large`）                      | 有 `children` 时盖在内容上；`spinning={false}` 只渲染子节点 |
| 模型 / Agent 在思考     | `Spin variant="network"`（`base-ui`）                                      | 只用于等模型。普通请求用默认 `Spin`                         |
| 聊天里等第一个 token    | `LoadingDots`（`chat`，`variant`: `dots`/`pulse`/`wave`/`orbit`/`typing`） | —                                                           |
| 整页结果（成功 / 失败） | `Result`（`base-ui`，`status`: `success`/`error`/`info`/`warning`）        | 比 Alert 重，比 toast 持久                                  |
| 没有数据                | `Empty`（顶层，`type`: `default`/`page`，可带 `action`）                   | 必须给下一步动作，不能只写「暂无数据」                      |
| 进度（线 / 环 / 分段）  | `Progress`（`base-ui`）                                                    | 确定百分比用它；不确定的等待用 Spin                         |
| 悬停提示                | `Tooltip`（`base-ui`）                                                     | 不能放可交互内容                                            |
| 可交互的浮层内容        | `Popover`（`base-ui`，`trigger`: `hover`/`click`/`both`）                  | 要放链接或按钮就用它                                        |

### 覆盖层与菜单

| 需要                    | 用                                                          | 真实差别                                    |
| ----------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| 打断流程、要求关注      | `Modal`（`base-ui`；命令式 `createModal` / `confirmModal`） | 焦点锁在内部，背景对屏幕阅读器惰性          |
| 从边缘滑入的面板        | `Drawer`（`base-ui`）                                       | 打断程度低于 Modal，可承载更多信息          |
| 底部 / 侧边 sheet       | `FloatingSheet`（`base-ui`）                                | 移动端常替代 Modal                          |
| 锚定在触发元素上的菜单  | `DropdownMenu`（`base-ui`）                                 | 有 `trigger`，跟着某个元素                  |
| 右键 / 程序化唤起的菜单 | `showContextMenu()` + `ContextMenuHost`（`base-ui`）        | 命令式、出现在指针位置，无 trigger 子元素   |
| 常驻导航菜单            | `Menu`（顶层）                                              | 持久存在，不是浮层。不要从 antd 导入 `Menu` |
| 编辑器里的斜杠命令      | `EditorSlashMenu`（顶层）                                   | 编辑器专用，不是通用 Select                 |

### 布局与容器

| 需要             | 用                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| flex 排布        | `Flexbox` / `Center`（顶层，`gap` 取 `2\|4\|8\|12\|16\|24`）                                    |
| 带表面语义的容器 | `Block`（顶层，`variant`: `filled`/`outlined`/`borderless`，另有 `glass`/`shadow`/`clickable`） |
| 自适应列数的网格 | `Grid`（顶层，`maxItemWidth`）                                                                  |
| 整页外壳         | `Layout` + `LayoutHeader` / `LayoutSidebar` / `LayoutMain` / `LayoutToc` / `LayoutFooter`       |
| 可拖拽伸缩的面板 | `DraggablePanel`（`base-ui`，`placement` 四向，`mode`: `fixed`/`float`）                        |
| 固定窄导航栏     | `SideNav`（顶层，`avatar` + `topActions` + `bottomActions`）                                    |
| 可伸缩侧栏容器   | `DraggableSideNav`（顶层，仅左右，折叠宽度 = `minWidth`，默认 64px）                            |
| 自定义滚动条     | `ScrollArea`（`base-ui`，`scrollFade`）                                                         |
| 滚动到边缘的渐隐 | `ScrollShadow`（顶层，保留原生滚动）或 `MaskShadow`（顶层，单边静态遮罩）                       |
| 页内目录         | `Anchor`（`base-ui`，滚动监听）。顶层 `Toc` 是旧封装，新代码用 `Anchor`                         |
| 移动端汉堡菜单   | `Burger`（`base-ui`，打开抽屉里的 `List`，或全屏大字）                                          |

`Block` 是 `Flexbox` 的超集（多了表面语义），`Grid` 是 `Flexbox` 之上的 CSS auto-fit 网格。**需要卡片就用 `Block`**，antd 的 `Card` 已禁。控制台里抬高一档的面板用 dashboard 的 `Surface`，不要用 `Block` 再套一层工作区底色。

`HtmlPreview` 渲染的是不可信 HTML，**不要覆盖它的 `sandbox` 属性**。另外没有 `<html>` 外层的片段会留在 source 视图、不进 iframe，`fullFeatured` / `showLanguage` 在这个组件上是空操作。

### 内容展示

| 需要                               | 用                                                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 排版文字（省略号、语义色）         | `Text`（`base-ui`，`type`: `secondary`/`success`/`warning`/`danger`/`info`）                                           |
| 完整 markdown / 流式输出           | `Markdown`（顶层，`variant`: `default`/`chat`，可开 `enableStream`/`enableMermaid`/`enableLatex`/`enableHtmlPreview`） |
| 只读代码块                         | `Highlighter`（顶层，shiki）                                                                                           |
| 可编辑代码                         | `CodeEditor`（顶层，`language` 必填）                                                                                  |
| 代码差异                           | `CodeDiff` / `PatchDiff`（顶层，`viewMode`: `split`/`unified`）                                                        |
| 可复制的单行命令                   | `Snippet`（顶层，支持 `prefix`）                                                                                       |
| 流程图（mermaid）                  | `Mermaid`（顶层）                                                                                                      |
| 渲染 HTML 产物                     | `HtmlPreview`（顶层，沙箱 iframe，`mode`: `preview`/`source`）                                                         |
| 图片（含预览画廊）                 | `Image` / `Image.PreviewGroup`（顶层）；自定义触发器用 `useImagePreview`，渲染它返回的 `outlet`                        |
| 标签（分类 / 状态）                | `Tag`（`base-ui`）                                                                                                     |
| 可选择的行（图标、描述、尾部操作） | `List`（`base-ui`，`items` + `activeKey`）                                                                             |
| 会话式列表行（标题、时间、置顶）   | `List` / `List.Item`（顶层，另一套 API，不要和 base-ui `List` 混用）                                                   |
| 数据表格                           | `Table`（`base-ui`，列形状接近 antd，内核是 TanStack Table。服务端排序用 `sorter: true` + `onChange`）                 |
| 计数或状态点                       | `Badge`（`base-ui`，锚在子元素角上）                                                                                   |
| 页码                               | `Pagination`（`base-ui`）                                                                                              |
| 评分                               | `Rate`（`base-ui`，只读可以是小数）                                                                                    |
| 标签-值描述列表                    | `Descriptions`（`base-ui`）                                                                                            |
| 带千分位的指标数字                 | `Statistic`（`base-ui`）；控制台指标瓦片用 dashboard 的 `StatCard`                                                     |
| 多步流程                           | `Steps`（`base-ui`）                                                                                                   |
| 轮播                               | `Carousel`（`base-ui`）                                                                                                |
| 二维码                             | `QRCode`（`base-ui`，两套主题都是深色码、白底）                                                                        |
| 分隔线                             | `Divider`（`base-ui`）                                                                                                 |
| 可拖拽排序的列表                   | `SortableList`（顶层，dnd-kit）                                                                                        |
| 键盘快捷键展示                     | `Hotkey`（顶层）                                                                                                       |
| 图表                               | `@lobehub/charts` —— 见 [ecosystem.md](ecosystem.md)                                                                   |

### 图标与头像

| 需要                         | 用                                                                      |
| ---------------------------- | ----------------------------------------------------------------------- |
| 渲染一个图标                 | `Icon`（顶层，lucide）                                                  |
| 可点击的图标按钮             | `ActionIcon`（`base-ui`）                                               |
| 一组图标动作（可带溢出菜单） | `ActionIconGroup`（顶层）                                               |
| 头像                         | `Avatar` / `AvatarGroup`（`base-ui`）                                   |
| 多人马赛克头像               | `GroupAvatar`（顶层，`grid`: `2`/`3`/`auto`）                           |
| AI 模型 / 厂商 logo          | `@lobehub/icons` —— 见 [ecosystem.md](ecosystem.md)                     |
| OAuth / 社交平台 logo        | `@lobehub/ui/icons`（Auth0、Discord、Slack、WeChat 等）                 |
| emoji                        | `FluentEmoji`（顶层，`type`: `anim`/`flat`/`modern`/`mono`/`raw`/`3d`） |
| 文件类型图标                 | `FileTypeIcon`（内置 SVG）或 `MaterialFileTypeIcon`（CDN）              |

## C-03 易混组件对照

外观相似、语义不同。混用会让用户重新学习每个组件在这个产品里的含义。

| 组件对                                                | 看起来像       | 真正差别                                                                                            |
| ----------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------- |
| `Tag` / `Badge`                                       | 都是小标签     | `Tag`（base-ui）表分类、独立、可移除；`Badge`（base-ui）附着在别的元素上、表计数或状态              |
| `Modal` / `Drawer` / `FloatingSheet`                  | 都是弹出层     | 打断程度、信息密度、退出方式递减；Modal 最强打断                                                    |
| `Modal` 里的表单 / 旧 `FormModal`                     | 都是对话框     | 新代码用 `Modal` 包 `@lobehub/ui/form` 的 `Form`。`FormModal` 已废弃                                |
| `Tabs` / `Segmented`                                  | 都能切换       | Tabs 管同空间内的多个面板；Segmented 管少量互斥选项，没有独立面板区                                 |
| `DropdownMenu` / `ContextMenu` / `Menu`               | 都是菜单       | DropdownMenu 挂在 trigger 上；ContextMenu 命令式、出现在指针处；Menu 是常驻导航                     |
| `Tooltip` / `Popover`                                 | 都是浮层       | Tooltip 只放简短提示、不能含可交互内容；要放链接或按钮必须用 Popover                                |
| `Alert` / `toast`                                     | 都是提示       | Alert 常驻行内；toast 瞬时且命令式调用                                                              |
| `Skeleton` / `Spin` / `Spin variant="network"`        | 都是等待       | Skeleton 模拟已知布局；默认 Spin 是不确定等待或遮罩；`network` 只表示模型或 Agent 在工作            |
| `Accordion` / `Collapsible`                           | 都能折叠       | Accordion 管多节（可单开）；Collapsible 只管一个区域                                                |
| `SideNav` / `DraggableSideNav` / `LayoutSidebar`      | 都是侧栏       | SideNav 固定窄栏不可调；DraggableSideNav 是通用可伸缩容器（不限导航）；LayoutSidebar 是整页骨架插槽 |
| `ScrollArea` / `ScrollShadow` / `MaskShadow`          | 都处理滚动边缘 | ScrollArea 替换滚动条 UI；ScrollShadow 保留原生滚动只加阴影；MaskShadow 是单边静态遮罩              |
| `Highlighter` / `CodeEditor` / `Snippet` / `CodeDiff` | 都是代码块     | 只读 / 可编辑 / 单行可复制命令 / 前后差异                                                           |
| `FileTypeIcon` / `MaterialFileTypeIcon`               | 都是文件图标   | 前者内置 SVG 按扩展名；后者走 CDN 的 Material 图标按文件名，失败回退前者                            |
| `Icon` / `ActionIcon` / `ActionIconGroup`             | 都是图标       | 纯展示 / 可点击按钮 / 一组按钮带溢出菜单                                                            |
| `Text` / `Markdown`                                   | 都渲染文字     | Text 是排版原语；Markdown 是完整管线（代码、公式、mermaid、流式）                                   |
| `Select` / `AutoComplete` / `EmojiPicker`             | 都是选择       | 固定选项 / 自由文本加建议 / 头像与 emoji 选择弹层                                                   |
| 顶层 `List` / base-ui `List`                          | 都叫 List      | 顶层是会话行（标题、时间、置顶）；base-ui 是通用可选行（`items`、图标、描述、尾部动作）             |
| `ColorSwatches` / `ColorPicker`                       | 都是选颜色     | Swatches 点预设色；ColorPicker 拾取任意 hex，写入放在 `onChangeComplete`                            |
| `Anchor` / `Toc`                                      | 都是目录       | `Anchor`（base-ui）是滚动监听的页内目录；顶层 `Toc` 是旧封装，新代码用 `Anchor`                     |
| `Menu` / `ConsoleNav`                                 | 都是导航       | `Menu` 是通用常驻菜单；`ConsoleNav` 是控制台侧栏，会随 `ConsoleShell` 收成图标轨                    |
| `Block` / `Surface`                                   | 都是卡片表面   | `Block` 是通用表面（`variant` / `shadow`）；`Surface` 是控制台工作区里抬高一档的面板                |
| `Statistic` / `StatCard`                              | 都是数字       | `Statistic` 只排一个带格式的数；`StatCard` 是控制台指标瓦片，带标签和语义涨跌                       |

### 一个具体例子

资产列表里同时有「运行中」「高危」「ECS」「生产环境」四类短文本。全做成同一种 `Tag` 视觉上最整齐，但语义被抹平了，用户的判断会变慢。正确的拆分：

| 字段     | 语义     | 选择                                     |
| -------- | -------- | ---------------------------------------- |
| 运行中   | 运行状态 | 状态标签，取值集合封闭                   |
| 高危     | 风险等级 | 稳定映射到语义色（见 design.md 的 D-03） |
| ECS      | 资源类型 | 分类 `Tag`，不可移除                     |
| 生产环境 | 业务分类 | 分类 `Tag`，可移除                       |

## C-04 对话界面的组合顺序

`@lobehub/ui/chat` 的组件是为固定的组合关系设计的：

```
ChatHeader（可选，配 ChatHeaderTitle）
ChatList                          ← 可滚动区，消费 ChatMessage[]
  └─ ChatItem                     ← ChatList 自动为每条消息渲染
       ├─ EditableMessage         ← 默认消息体
       └─ ChatActionsBar          ← 默认操作栏（复制/编辑/重新生成/删除）
ChatInputArea                     ← 底部输入区
  ├─ ChatInputArea.ActionBar
  ├─ ChatInputArea.Inner
  └─ ChatInputArea.SendButton
BackBottom                        ← 浮层，指向滚动容器
```

要点：

- `ChatList` 接 `data: ChatMessage[]`，通过按角色分派的 `renderMessages` / `renderActions` / `renderErrorMessages` 定制，**不要绕过它自己 map**。
- `ChatItem` 的 `placement`（`left`/`right`）和 `variant`（`bubble`/`docs`）决定气泡形态。
- `ChatInputArea` 基于 `DraggablePanel`，本身可拖拽调高；用 `.Inner` / `.ActionBar` / `.SendButton` 自行组装更自由的布局。
- 移动端换成 `@lobehub/ui/mobile` 的 `ChatHeader` / `ChatInputArea`（带 `safeArea`，不含 DraggablePanel），配 `TabBar` 和 `SafeArea`。这是**显式的另一套组件，不会按视口自动切换**。
- `TokenTag` 显示 token 用量（`mode`: `remained`/`used`），通常放在头部或工具栏。
- 工具调用和思考过程**没有现成的消息块**。`ChatMessage` 上有 `plugin` 字段，结构自己渲染；等待模型时用 `Spin variant="network"`，不要用默认 `Spin` 或第三方加载包。

对话流之外还有三个编辑器组件，容易被漏掉：

| 需要                                               | 用                                         |
| -------------------------------------------------- | ------------------------------------------ |
| 调 prompt：编辑 system / user / assistant 消息列表 | `EditableMessageList`（收 `LLMMessage[]`） |
| 代码编辑器形态的消息编辑（带确认/取消）            | `MessageInput`                             |
| 把消息编辑放进弹层                                 | `MessageModal`                             |

`EditableMessage` 会在内部用到后两者。注意 `EditableMessageList` 消费的是 `LLMMessage[]`（prompt 调试用），不是 `ChatMessage[]`（实时会话用）——两个类型不能混。

## C-05 这个库里没有的组件

| 期望的组件                                                                       | 去哪里拿                                                                    |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| antd `Card`                                                                      | 顶层 `Block`，或 dashboard 的 `Surface`                                     |
| antd `FloatButton`                                                               | 定位过的 `ActionIcon` / `Button`。没有浮动按钮组件                          |
| antd `Typography`                                                                | base-ui 的 `Text`                                                           |
| `ToggleGroup` · `FloatingPanel` · `FloatingSheet` · `Collapsible` · `FocusScope` | 只在 `base-ui` 里，顶层桶没有                                               |
| 虚拟滚动                                                                         | `base-ui` 的 `MenuVirtualList` / `VirtualScrollArea` / `useMenuVirtualList` |

`Table`、`Badge`、`Progress`、`Rate`、`Spin`、`Result`、`Pagination`、`Upload`、`Empty` 都已经有实现，不要再从 antd 拿。

## C-06 其他命名空间

| 命名空间                 | 装什么                                                                                                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@lobehub/ui/form`       | 受控表单：`Form` · `useForm` · `useWatch`。不要从别的入口导入 `Form`                                                                                                                     |
| `@lobehub/ui/dashboard`  | 控制台骨架，见 C-07                                                                                                                                                                      |
| `@lobehub/ui/awesome`    | 营销页。整页组合交给 `building-landing-home`。效果件：`AuroraBackground` · `GradientButton` · `Spotlight` · `SpotlightCard` · `FluidGradient` · `TypewriterEffect` · `Spline` · `Giscus` |
| `@lobehub/ui/brand`      | `LobeHub` · `LobeChat` 及其文字标 · `Logo3d` / `LogoFlat` / `LogoMono` · `BrandLoading`                                                                                                  |
| `@lobehub/ui/mdx`        | 文档渲染：`Mdx` · `mdxComponents` · `Callout` · `Cards` · `Steps` · `FileTree` · `Tabs`                                                                                                  |
| `@lobehub/ui/color`      | 色阶数据：`colors` / `colorScales` / `neutrals`（见 [design.md](design.md)）                                                                                                             |
| `@lobehub/ui/i18n`       | `I18nProvider` · `useTranslation` · `en` / `zhCn` 资源                                                                                                                                   |
| `@lobehub/ui/storybook`  | 演示用：`StoryBook` · `useControls`（不是生产 UI）                                                                                                                                       |
| `@lobehub/ui/eslint`     | 强制 C-01 各项迁移规则的 eslint 配置，另有 `no-inline-form-schema`                                                                                                                       |
| `@lobehub/ui/static-css` | 构建期抽取 antd CSS（SSR 优化，需 antd v6 cssVar 模式）                                                                                                                                  |

`awesome` 里的东西是给落地页的。**不要把 `AuroraBackground`、`GradientButton`、`SpotlightCard`、`FluidGradient` 搬进控制台或应用内页面**——那正是 AI 味的来源之一（见 [craft.md](craft.md) 的 K-01）。

## C-07 控制台套件

`@lobehub/ui/dashboard` 是产品控制台的骨架，不是另一套按钮。品牌、导航项、账户槽都空着，由应用填。

| 需要                     | 用                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| 整页：可折侧栏 + 工作区  | `ConsoleShell`。宽屏收成图标轨，窄屏变抽屉，Mod+B 切换；`storageKey` 记住折叠。品牌用 `ConsoleBrand`  |
| 分组侧栏导航             | `ConsoleNav`。链接渲染交给应用，不绑路由器。徽章在图标轨上变成点                                      |
| 页头（标题、说明、操作） | `PageHeader`                                                                                          |
| 顶栏位置                 | dashboard 的 `Breadcrumb`（当前页是纯文本，窄屏丢掉分组名）。应用内通用路径用 base-ui 的 `Breadcrumb` |
| 工作区里的面板           | `Surface`。底和边框比画布高一档，明暗都成立                                                           |
| 指标瓦片                 | `StatCard`。底是中性灰，语义只放在涨跌上，不要再给每张卡涂产品色                                      |
| 页内切换                 | `PageTabs`。条带横向滚动，不换行                                                                      |
| 左侧筛选 + 右侧内容      | `FilterSidebar`。窄屏收进抽屉。`FilterRow` 是树节点，`FilterOption` 是平铺选项                        |
| 登录 / 注册框            | `AuthLayout`。父级要有高度                                                                            |
| 路由切换时的顶栏         | `RouteProgress`。把路由器的 loading 传进去                                                            |
| 控制台页的加载形         | `PageLoading` / `PageHeaderSkeleton` / `StatCardSkeleton` / `TableSkeleton`                           |

控制台密度见 [craft.md](craft.md) 的 K-09。不要在 `Surface` 上再叠玻璃、渐变或等大卡片墙。
