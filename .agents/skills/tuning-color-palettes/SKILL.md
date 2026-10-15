---
name: tuning-color-palettes
description: >
  Use when retuning or customizing lobe-ui color tokens: an enterprise / white-label palette, a
  custom brand primary, status colors (error / warning / info / success) that feel off, dark-mode
  text glare, colors drifting pink / gray / muddy / brown, uneven Alert or Tag levels between light
  and dark, or edits to scripts/generateColorTokens.ts and src/color/status. Trigger on 定制色板,
  企业版色板, 品牌色, 调色, 色阶, 状态色, 发粉, 发灰, 发黑, 对比度, HCT, Radix colors.
---

# Tuning color palettes

lobe-ui 的状态色是用 `scripts/generateColorTokens.ts` **生成**的：每个主题共用一条 HCT tone/chroma 梯度，保证层级一致；step 9 的 tone 拉回种子色的 tone，保住每个色相的分量；色相旋转数据保住观感。hue 取 master hue，chroma 取梯度，所以种子 hex 本身**不会**原样出现（`#ec5e41` 生成为 `#f35837`）。要求精确命中品牌 hex 时，必须显式 pin step 9。

定制色板就是换输入参数重新生成，再交给人眼评审，不手改 hex。全部数值、角色映射和被否掉的方案见 `references/method.md`，动手前先读它的「Rejected approaches」一节。

## 工作流

1. **测量现状。** 跑 `pnpm exec tsx .agents/skills/tuning-color-palettes/scripts/audit-palette.ts`。可选参数：`--primary '#hex'`、`--neutral sand`、`--scales file.json`（`{ error?, warning?, info?, success?, primary? }`，值是 `ColorScaleItem`，也就是要注册的命名色板）、`--json`。它按角色输出 hex、H/C/T、WCAG 比值和 APCA Lc，亮暗各一套。改之前跑一次，改之后再跑一次。
2. **向需求方一次问清下面几项，不要自己拍：**
   - 锚点：现有哪个组件在哪个主题下「看着对」。lobe 自己的锚点是亮色 Warning Alert 和暗色 Info Alert。
   - 每个状态的种子 hex，或者可以接受的色相方向；品牌色是否必须精确命中。
   - 交付形态，见「交付」。
   - 中性色、border、surface 是否保持不动。默认不动。
3. **为每个新色相准备输入，不复用旧数据：**
   - `MASTER_HUE`：亮暗可以不同，不强求同色相。
   - `ORIGINAL_BASE`：换成客户的种子。main pull 会拉向这里的 tone，不换就会拉向 lobe 旧色的 tone。
   - 色相旋转：`LIGHT_HUE_OFFSET` 是从 lobe 旧色板逐阶测出来的，`DARK_HUE_CURVE` 是从 Radix tomato/amber/blue/grass 测出来的，只对原色相有效。色相移动超过约 15° 时要重新测：
     1. 选最接近的 Radix 色阶。
     2. 跑 `npm pack @radix-ui/colors@3.0.0`，解压到 scratchpad。
     3. 跑 `pnpm exec tsx .agents/skills/tuning-color-palettes/scripts/measure-radix.ts <dir>/package crimson orange teal`。
     4. 亮色取 `<scale>` 行的 `offsets`（逐阶数组），幅度减半，因为 Radix 亮色曲线会把 tint 推向卡其或灰青。暗色取 `<scale>Dark` 行的 `curve`，两端的离群点删掉。
4. **生成并审计。** 生成器参数化成 preset，默认 preset 的输出必须和仓库现有文件逐字节一致（`src/color/status/status.test.ts` 会校验）。新 scale 输出成 JSON，用 `--scales` 审计，再逐条核对下面的硬性判据。
5. **做可调的评审板，让人眼来定。** 用 tsdown 把 HCT 库打成 IIFE，放进画板。滑杆覆盖亮/暗 master hue、tint 彩度、solid 彩度、base tone、main pull、hue rotation 强度和 warning lift。每组面板把 now 和 tuned 的 Alert / Tag / Button 并排，亮暗各一组。画板底部打印当前参数，需求方复制给你，你写回 preset。做法细节见 method.md「Live tuner board」。
6. **落地并验证。** 重新生成，更新 snapshot，给 preset 补 invariant 测试，覆盖判据表里能自动化的每一行。用 `local-testing` skill 在亮暗两种主题下看 Alert、Tag、Toast、Tooltip、Markdown 链接、Button 和 `/design-tokens`。

## 硬性判据

| 检查      | 规则                                                                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 单调      | step 1–11 的 tone 严格单调：亮色递减，暗色递增。warning lift 用渐变权重加上去，不能在单阶突加                                                                                  |
| 层级一致  | 同一主题内，各 scale 的 Bg / BgHover / Border / BorderHover 对比度相同（±0.02:1）。base 被 main pull 拉回各自种子的 tone，所以有意不同                                         |
| 亮色 Text | ≥ 4.5:1，且比 main 暗 ≥ 8 tone。黄色例外：tone < 65 会发褐，宁可降低对比度                                                                                                     |
| 暗色正文  | `colorText` 不能是 `#fff`。lobe 用 tone 91 的 `#e6e6e6`                                                                                                                        |
| 防偏粉    | error 中 chroma ≥ 3 的阶，hue ≥ 15°。暗色 master hue 的下限是 15 + 暗色曲线最大负偏移（tomato 为 6.5，所以 ≥ 21.5）。客户要 crimson 时，把下调写进 preset 和测试，并告知需求方 |
| 色域      | tone 98/99 时暖色会翻成紫色。gamut guard 每次降 0.5 chroma，直到 hue 偏差 ≤ 8°                                                                                                 |
| 暗色荧光  | 暗色 base tone 上限 74。高彩度加高 tone 会刺眼（旧 lime 就是例子）                                                                                                             |
| 品牌撞色  | 自定义主色与 success、info 的 hue 差 ≥ 20°。注意 lobe 的 `cyan` 实际是薄荷绿（约 170°）                                                                                        |

## 审美判据（需求方的原话）

- 「太接近灰阶 / 太大众化」：彩度给低了。solid 阶可以比旧色板更艳，tint（step 1–4）保持柔和。
- 「发灰」：浅色段没做色相旋转，或 tint 彩度不足。亮色 step 1–5 约为 C 6/10/15/20/28。
- 「发黑 / 发褐」：黄橙被压到了自己的自然 tone 以下。solid 阶要停在该色相自己的 tone 上，不能为了统一而压低。T65 的 Text override 和 +7 lift 是按 amber 调的；换成橙色等其他暖色时，lift 从 0 开始，在评审板上扫 tone 让需求方选。
- 「偏粉」：暗色红的 hue 落进 4–10°，或者彩度太高。
- 「填充太淡」：亮色 Bg / BgHover 太接近白。lobe 用 T98/96。
- 色域不够（例如 teal 在 T50 最多约 C45，today's blue 有 C63）：把「接受低彩度」和「hue 往能撑住彩度的方向挪」两个版本都放上评审板。
- 纯 HCT 梯度层级很稳，但不能保证每一格都好看。所以要拉回种子 tone，并且按色相做旋转。

## 主色（品牌色）

先用 `setLobeTheme({ primaryColor: '#hex' })` 加 `audit-palette.ts --primary '#hex'` 看效果。`generatePrimaryScale` 的规则：

- 参考 preset 按 hue 和亮度一起选。只按 hue 选的话，深绿会选中极浅的 `cyan` 薄荷绿。
- 亮色 step 9 就是选定的 hex，相邻阶按渐变权重跟随，整条色阶保持单调。
- 暗色下，如果它在暗色容器上不到 4.5:1，就保持 hue 和 chroma 不变、把亮度提到 4.5:1。比如 `#1a7f5a` 在暗色下是 `#298a64`。需求方要求暗色也精确命中 hex 时，要明确告诉对方这会牺牲可读性。

运行时结果不满意（tint 不够，或需要按色相旋转）时，可以按状态色的方法生成静态 scale，但 `registerLobePalette` 不收 primary。这种情况下只能写覆盖 CSS：`--lobe-color-primary*` 变量，选择器与 `themeCss.ts` 一致，在 `theme.css` 之后加载，并且不要再设 `data-primary-color`。`useTheme()` 拿到的 `colorPrimary` 仍是运行时生成的值，交付时要把这一点告诉需求方。

## 交付

| 形态             | 做法                                                                                                                                                                                                                                                                                                     | 注意                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 命名色板（默认） | 生成器输出四个状态的 `ColorScaleItem`，客户在模块顶层调用 `registerLobePalette('acme', { error, warning, info, success })`，再用 `setLobeTheme({ palette: 'acme' })`、`<ThemeScope palette>` 或 `<LobeThemeScript palette>` 启用。CSS 和 `useTheme()` 读同一份注册表；SSR 用 `getCustomPaletteCss(name)` | 名字只能用字母、数字、`_`、`-`。同名重新注册后要再调一次 `setLobeTheme`，root 上的样式表才会重写 |
| 主色             | `primaryColor: '#hex'`，按「主色」一节检查                                                                                                                                                                                                                                                               | 不需要再写覆盖 CSS                                                                               |
| 仓库内 preset    | 生成器读 preset，输出 scale 文件，默认文件不变                                                                                                                                                                                                                                                           | 客户名会进入公开仓库，先确认是否允许                                                             |

## 常见错误

| 错误                                                                | 正确做法                                                                                               |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 直接挑现有色阶的 10–11 阶当新值                                     | 色阶内部的 hue/chroma 会漂移，warning 变褐，暗色 error 变粉。要用生成器                                |
| 用 OKLCH 统一 L/C，强行拉齐四个状态                                 | 结果亮色发灰、暗色发粉。层级靠 HCT tone，性格靠种子 tone 和色相旋转                                    |
| 凭记忆写 Radix 色值                                                 | 从 registry tarball 取，用 measure-radix 测                                                            |
| 新色相沿用旧 offset 或旧 `ORIGINAL_BASE`                            | 每个新色相重新测旋转数据，并换成客户的种子                                                             |
| 以为生成器会保留种子 hex                                            | 只保留种子的 tone。要精确命中就 pin step 9                                                             |
| 顺手改 border、surface 或灰阶                                       | 影响面太大。需求方没点名就不动                                                                         |
| 手改生成出来的 `src/color/status/*.ts`                              | 改参数后重新生成。`status.test.ts` 会拦下不一致的文件                                                  |
| `@material/material-color-utilities` 0.4.0 在纯 Node 下 import 失败 | 它的 index 有不带扩展名的 import。用 `tsx` 跑，或者直接 import `hct/hct.js` 和 `utils/string_utils.js` |
