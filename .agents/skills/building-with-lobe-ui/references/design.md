# design.md — 视觉事实源

定义视觉系统怎么表达、怎么取值、怎么派生、怎么暴露缺口。

不判断某个业务状态意味着什么（那是领域语义），也不评判一个页面用得是否克制（那是 [craft.md](craft.md)）。同一个红色，在这里只回答一件事：**它引用哪个 token**。

规则可被 [evaluator.md](evaluator.md) 按编号引用。

## D-01 唯一事实源是 cssVar

```ts
import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, cx, responsive }) => ({
  root: css`
    padding-inline: 16px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};
    background: ${cssVar.colorBgContainer};
    color: ${cssVar.colorText};
  `,
}));
```

`cssVar.xxx` 输出的是 CSS 变量引用，随明暗外观自动切换。这是它比 `token.xxx` 更重要的原因：**用 cssVar 写的样式天然支持暗色模式，不需要任何分支**。

`createStyles` 已被 `@lobehub/ui/eslint` 禁用，只用 `createStaticStyles`。仓库里约 170 个 `style.ts` 全是这个写法，零例外。

## D-02 先判断视觉角色，再取 token

把 token 当色板用（「看到蓝色就随手取一个接近的蓝」）是系统失去一致性的起点。

| 角色                   | token                                                                            |
| ---------------------- | -------------------------------------------------------------------------------- |
| 页面底色               | `colorBgLayout`                                                                  |
| 卡片 / 内容表面        | `colorBgContainer`                                                               |
| 介于两者之间的表面     | `colorBgContainerSecondary`（lobe-ui 自有，二者 50% 混合）                       |
| 浮层表面（弹窗、菜单） | `colorBgElevated`                                                                |
| 遮罩                   | `colorBgMask`                                                                    |
| 主文字                 | `colorText`                                                                      |
| 次要文字               | `colorTextSecondary`                                                             |
| 更弱的文字             | `colorTextTertiary` → 最弱 `colorTextQuaternary`                                 |
| 描述文字               | `colorTextDescription`                                                           |
| 边框                   | `colorBorder`，更弱 `colorBorderSecondary`                                       |
| 填充（悬停底、轨道）   | `colorFill` > `colorFillSecondary` > `colorFillTertiary` > `colorFillQuaternary` |
| 主 CTA / 品牌实色      | `colorPrimary`，悬停 `colorPrimaryHover`，按下 `colorPrimaryActive`              |
| 低强度品牌强调         | `colorPrimaryBg` / `colorPrimaryFillTertiary`                                    |
| 正文链接               | `colorLink`，悬停 `colorLinkHover`                                               |
| 阴影                   | `boxShadow` / `boxShadowSecondary` / `boxShadowTertiary`                         |

四档 `colorFill` 和四档 `colorText` 是**层级**而不是同义词。同一视觉层的两个元素不应该取不同档位。

## D-03 状态色一律从基础 token 派生

五组语义色，每组都有完整的角色派生。**不要为某个状态新造颜色**——没有派生机制，每个状态都会被重新发明一个值：今天按钮 hover 深一点，明天卡片 selected 浅一点，后天暗色模式又换一套。

```
color{Primary|Success|Warning|Error|Info} 各自提供：
  {}                       实色（主色）
  {}Hover / {}Active       交互态
  {}Bg / {}BgHover         浅色底
  {}Border / {}BorderHover 边框
  {}Text / {}TextHover / {}TextActive           文字
  {}Fill / {}FillSecondary / {}FillTertiary / {}FillQuaternary  填充档位
```

底层色阶映射（浅色模式）：`success` → green，`warning` → gold，`error` → volcano，`info` → geekblue。暗色模式下部分换阶（success → lime，error → red，info → blue），由主题自动处理，不需要介入。

**已知缺口：** `colorErrorFillTertiary` 和 `colorErrorFillSecondary` 不在 `cssVar` 里。需要错误色浅底时用 `cssVar.colorErrorBg` / `cssVar.colorErrorBgHover`。

## D-04 几何与排版取值

| 用途     | token                                                                            |
| -------- | -------------------------------------------------------------------------------- |
| 圆角     | `borderRadiusXS` 4 · `borderRadiusSM` 6 · `borderRadius` 8 · `borderRadiusLG` 12 |
| 控件高度 | `controlHeight` 36（base-ui 另有常量：small 24 / middle 32 / large 40）          |
| 字体     | `fontFamily`（西文 → 中文 → 回退 → emoji 的完整栈）                              |
| 等宽字体 | `fontFamilyCode`                                                                 |

**没有** `borderRadiusLarge`，用 `borderRadiusLG`。

圆角是嵌套关系：内层 = 外层 − padding。外层 `borderRadiusLG`（12）配 4px padding，内层取 `borderRadius`（8）。两层同值会出现可见缝隙。

字体栈已由 `ThemeProvider` 的全局样式注入，包含中文字体。**不要在组件里另写 `font-family`**——这是中文行高、标点和字重失真的主要来源。

## D-05 预设色阶用于「需要互相区分」的场合

13 个预设色：`red` `volcano` `orange` `gold` `yellow` `lime` `green` `cyan` `blue` `geekblue` `purple` `magenta` `gray`。

每个色提供：

```
{color}1 … {color}11      实色色阶
{color}1A … {color}11A    带透明度的色阶
{color}Fill / FillSecondary / FillTertiary / FillQuaternary
{color}Bg / {color}BgHover
{color}Border / {color}BorderSecondary / {color}BorderHover
{color}                   主色
{color}Hover / {color}Active
{color}Text / {color}TextHover / {color}TextActive
```

例如 `cssVar.geekblueText`、`cssVar.redFillTertiary`、`cssVar.gray7`。

这些用于**需要多个互相区分的颜色**：图表系列、分类标签、多维度对比。单个元素的主次强调走 `colorPrimary` 和中性灰阶，不要从预设色里随手挑一个。

原始色阶数据也可直接取：

```ts
import { colorScales, neutralColorScales } from '@lobehub/ui/color';
```

## D-06 复用现成的表面工艺

不要每次重写边框和背景：

```ts
import { lobeStaticStylish } from '@lobehub/ui';

export const styles = createStaticStyles(({ css, cx }) => ({
  card: cx(
    lobeStaticStylish.variantFilled,
    css`
      padding: 12px;
    `,
  ),
}));
```

| 工艺                                                                        | 用途                                             |
| --------------------------------------------------------------------------- | ------------------------------------------------ |
| `variantFilled` / `variantOutlined` / `variantBorderless`                   | 三种表面形态，各自带 hover                       |
| `variantFilledDanger` / `variantOutlinedDanger` / `variantBorderlessDanger` | 危险态版本                                       |
| `variant*WithoutHover`                                                      | 不需要交互反馈的静态表面                         |
| `active`                                                                    | 选中态（文字 + 填充）                            |
| `disabled`                                                                  | `cursor: not-allowed; opacity: 0.5`              |
| `shadow`                                                                    | 多层阴影，明暗模式取值不同                       |
| `blur` / `blurStrong`                                                       | 模糊 10px / 36px——只给语义浮层，见 K-04          |
| `gradientAnimation`                                                         | 品牌循环渐变（gold → magenta → geekblue → cyan） |
| `noScrollbar` / `bottomScrollbar`                                           | 滚动条处理                                       |
| `resetLinkColor`                                                            | 次要文字色的链接                                 |

`Block`、`ActionIcon`、`Alert` 等组件的 `variant` prop 就是这套工艺的封装。**能用 prop 表达就不要自己写 CSS。**

## D-07 品牌气质通过主题声明，不靠覆盖 token

```tsx
<ThemeProvider
  customTheme={{
    primaryColor: 'geekblue',
    neutralColor: 'slate',
  }}
>
```

- `primaryColor`：`blue` `cyan` `geekblue` `gold` `green` `lime` `magenta` `orange` `purple` `red` `volcano` `yellow`
- `neutralColor`：`mauve` `olive` `sage` `sand` `slate`

中性色温决定页面底色偏暖、纯灰还是偏冷，会联动 `colorBgLayout` / `colorBgContainer` / `colorText` / `colorBorder` 一整组中性色。品牌色会派生出完整色阶，再挑出 hover / active / surface / border / text 各角色。

需要补项目自己的 token 时走 `customToken` / `customStylish`，它们与 lobe-ui 的定义**合并**而非替换。

## D-08 暗色模式默认不需要分支

```tsx
<ThemeProvider themeMode="auto" />
```

`themeMode` 取 `light` / `dark` / `auto`。**不要同时控制 `themeMode` 和 `appearance`。**

绝大多数样式不需要为暗色写任何分支——D-01 已经处理了。只在「token 选择本身要变」时才读运行时状态：

```ts
import { useThemeMode } from 'antd-style';

const { isDarkMode } = useThemeMode();
const resolvedVariant = variant ?? (isDarkMode ? 'filled' : 'outlined');
```

这是库里的真实用法（base-ui `Select` 的默认变体）。如果发现自己在写 `isDarkMode ? '#fff' : '#000'`，说明该换成 token。

## D-09 响应式只管视觉规则

```ts
createStaticStyles(({ css, responsive }) => ({
  root: css`
    padding-inline: 24px;

    ${responsive.sm} {
      padding-inline: 12px;
    }
  `,
}));
```

这一层管断点下字号如何缩放、间距如何收缩、触达面积如何保持。**页面从几栏变几栏属于骨架**，走 `Layout` 或换用 `@lobehub/ui/mobile` 的组件。

## D-10 执行约束

1. 颜色、圆角、阴影、字体一律走 `cssVar`。代码里不应出现裸 hex 或裸 rgba。
2. 间距可以写数值（库内普遍如此），但要用 4 的倍数并在同一区域内保持一致；`Flexbox` 的 `gap` 优先取预设档位 `2|4|8|12|16|24`。
3. 动效时长和缓动不要为了「活泼一点」改成弹跳曲线（见 K-06）。
4. 焦点态不可降级为 `outline: none`（见 K-07）。
5. 覆盖 antd 内部类名时用 `prefixCls`，不要写死 `.ant-`：

```ts
const prefixCls = 'ant';

css`
  .${prefixCls}-alert-message {
    color: inherit;
  }
`;
```

6. `//` 在 css 模板里不是注释，用 `/* */`（见 K-10）。
7. 描述单个实例的 CSS 自定义属性要挂在该实例自己的元素上。写到 `:root` 会被页面上所有实例共享，第二个挂载的实例会读到第一个的值当基线。

## D-11 合法失败：明示缺口，不要绕过

遇到规范缺口时用约定格式暴露它。

**有合理替代**——采用 fallback 并记录：

```
[low] 设计要求的 aurora 背景色不在 token 体系内
      fallback: 用 cssVar.colorBgLayout 纯色底；视觉略平
[med] active 态的 scale 因子(0.97) 无对应 token
      fallback: 内联写 0.97，违反 D-10.1 但无替代
```

**没有合理替代**——拒绝生成那一部分，说明缺什么 token，等补齐。

比起悄悄写一个 hex，明示缺口更有价值：它告诉团队哪些 token 还没覆盖真实场景，会进入下一轮设计系统迭代。悄悄写死的那个值只会在换品牌色、调密度或修暗色模式时，变成一个要逐个搜索替换的债。
