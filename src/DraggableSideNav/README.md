# DraggableSideNav

一个通用的可拖拽侧边容器组件，支持展开 / 折叠状态切换。

## 特性

- 🎯 **通用容器**: 不绑定特定内容，可以放置任何元素（Menu、自定义导航等）
- 📏 **智能拖拽**: 支持通过拖拽自动折叠 / 展开，智能阈值判断
- 🔄 **动态内容**: header、children、footer 可以是函数，根据折叠状态渲染不同内容
- 🎨 **灵活布局**: 独立定制 header、body、footer 三个区域
- ⚡ **流畅动画**: 点击折叠 / 展开有平滑的宽度过渡动画
- ✨ **渐变效果**: 支持 fade 动画，在内容切换时实现平滑过渡
- 🎛️ **完全控制**: 支持受控和非受控模式

## 文件结构

```
DraggableSideNav/
├── DraggableSideNav.tsx   # 主组件
├── type.ts                # TypeScript 类型定义
├── style.ts               # 样式定义
├── index.ts               # 导出文件
├── index.md               # 组件文档
├── README.md              # 说明文档
└── demos/                 # 示例目录
    ├── index.tsx          # 基础示例
    ├── custom-render.tsx  # 自定义渲染示例
    ├── controlled.tsx     # 受控组件示例
    └── placement-right.tsx # 右侧放置示例
```

## 核心概念

### 通用容器

DraggableSideNav 是一个**通用的可拖拽容器**，不绑定任何特定内容：

- 可以放置 Menu 组件（如 demo 所示）
- 可以放置自定义导航
- 可以放置任何其他内容（侧边栏、工具面板等）

### 动态内容渲染

所有内容区域（header、children、footer）都支持两种方式：

1. **静态值**: 直接传入 ReactNode
2. **函数**: 传入函数 `(collapsed: boolean) => ReactNode`，根据折叠状态渲染不同内容

```tsx
// 静态值
<DraggableSideNav header={<Avatar />}>
  <Menu items={items} />
</DraggableSideNav>

// 函数（动态）
<DraggableSideNav
  header={(collapsed) => (
    collapsed ? <Avatar size={40} /> : <Avatar size={48} />
  )}
>
  {(collapsed) => (
    <Menu inlineCollapsed={collapsed} items={items} />
  )}
</DraggableSideNav>
```

### 展开和折叠

- **展开状态**: 宽度可在 `minWidth` 到 `maxWidth` 之间拖拽调整
- **折叠状态**: 宽度固定为 `minWidth`（默认 64px）
- **智能切换**: 拖拽到阈值以下自动折叠，从折叠状态拖拽自动展开

### Fade 渐变动画

使用 framer-motion 为内容切换提供平滑的淡入淡出效果：

- 可以单独控制 header、body、footer 三个区域是否启用 fade 动画
- 当内容在折叠 / 展开状态之间切换时，fade 动画会创建平滑的视觉过渡
- 特别适合使用函数动态渲染内容的场景

```tsx
<DraggableSideNav
  fade={{
    header: true, // header 启用 fade 动画
    body: false, // body 不使用 fade
    footer: true, // footer 启用 fade 动画
  }}
  header={(collapsed) => (collapsed ? <CompactHeader /> : <FullHeader />)}
  footer={(collapsed) => (collapsed ? <CompactFooter /> : <FullFooter />)}
>
  {(collapsed) => <Menu inlineCollapsed={collapsed} />}
</DraggableSideNav>
```

## 主要属性

### DraggableSideNavProps

| 属性                      | 说明                   | 类型                                                     | 默认值   |
| ------------------------- | ---------------------- | -------------------------------------------------------- | -------- |
| `children`                | 主体内容（必需）       | `ReactNode \| ((collapsed: boolean) => ReactNode)`       | -        |
| `header`                  | 头部内容               | `ReactNode \| ((collapsed: boolean) => ReactNode)`       | -        |
| `footer`                  | 底部内容               | `ReactNode \| ((collapsed: boolean) => ReactNode)`       | -        |
| `collapsed`               | 折叠状态（受控）       | `boolean`                                                | -        |
| `defaultCollapsed`        | 默认折叠状态（非受控） | `boolean`                                                | `false`  |
| `onCollapsedChange`       | 折叠状态变化回调       | `(collapsed: boolean) => void`                           | -        |
| `minWidth`                | 最小宽度，也是折叠宽度 | `number`                                                 | `64`     |
| `maxWidth`                | 最大宽度               | `number`                                                 | -        |
| `placement`               | 放置位置               | `'left' \| 'right'`                                      | `'left'` |
| `resizable`               | 是否可拖拽调整         | `boolean`                                                | `true`   |
| `showHandle`              | 是否显示切换按钮       | `boolean`                                                | `true`   |
| `showHandleWhenCollapsed` | 折叠时是否显示切换按钮 | `boolean`                                                | `false`  |
| `fade`                    | 渐变动画配置           | `{ header?: boolean, body?: boolean, footer?: boolean }` | -        |

## 使用示例

### 基础用法（静态内容）

```tsx
import { DraggableSideNav, Menu } from '@lobehub/ui';

<DraggableSideNav>
  <Menu items={items} onSelect={handleSelect} />
</DraggableSideNav>;
```

### 动态内容（根据折叠状态变化）

```tsx
<DraggableSideNav
  header={(collapsed) => (collapsed ? <Avatar size={40} /> : <Avatar size={48} />)}
  footer={(collapsed) =>
    collapsed ? <ActionIcon icon={SettingsIcon} /> : <Button>Settings</Button>
  }
>
  {(collapsed) => (
    <Menu inlineCollapsed={collapsed} items={collapsed ? collapsedItems : allItems} mode="inline" />
  )}
</DraggableSideNav>
```

### 带徽章的菜单项

```tsx
const items = (collapsed) => [
  {
    key: 'messages',
    icon: <MessageIcon />,
    label: <Badge count={5}>Messages</Badge>,
  },
  // ... more items
];

<DraggableSideNav>{(collapsed) => <Menu items={items(collapsed)} />}</DraggableSideNav>;
```

## 样式定制

组件提供了 `classNames` 和 `styles` 属性，可以自定义以下部分：

- `container`: 最外层容器
- `content`: 内容容器
- `body`: 主体区域
- `header`: 头部区域
- `footer`: 底部区域
- `handle`: 切换按钮

## 技术实现

- 使用 `re-resizable` 实现拖拽调整大小
- 使用 `use-merge-value` 实现受控 / 非受控状态管理
- 使用 `antd-style` 进行样式管理
- 使用 `framer-motion` 实现 fade 渐变动画
- 支持函数式 props，根据折叠状态动态渲染内容
- 智能阈值计算，自动触发折叠 / 展开

## 依赖

- `re-resizable`: 拖拽调整大小
- `use-merge-value`: 状态管理
- `react-layout-kit`: 布局组件
- `framer-motion`: 动画库（用于 fade 效果）
- `lucide-react`: 图标（仅用于切换按钮）

## 注意事项

1. **通用容器**: DraggableSideNav 是通用容器，不绑定任何特定内容（如 Menu）
2. **函数式 props**: `children`、`header`、`footer` 可以是函数，接收 `collapsed` 参数
3. `minWidth` 即为最小可拖拽宽度，也是折叠宽度（默认 64px）
4. 仅支持水平方向的拖拽调整（宽度）
5. **智能折叠**：
   - 折叠阈值自动计算为：`minWidth + (expandedWidth - minWidth) / 3`
   - 拖拽宽度小于阈值时自动折叠到 `minWidth`
   - 从折叠状态拖拽出来时自动展开
6. **平滑动画**：点击 handle 切换折叠 / 展开时有 300ms 的宽度过渡动画
7. **Fade 动画**：
   - 启用 `fade` 配置后，内容切换时会有淡入淡出效果
   - 可以单独控制 header、body、footer 是否使用 fade
   - 特别适合函数式 props 渲染不同内容的场景
8. Demo 中使用 Menu 只是一个示例，你可以放置任何内容
9. 使用函数式 props 可以根据折叠状态渲染完全不同的内容
