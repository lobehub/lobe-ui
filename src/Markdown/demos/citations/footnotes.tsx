import { Markdown } from '@/index';

const code = `
是的,我了解 ToDesktop。ToDesktop 是一个专门用于将 Web 应用转换成桌面应用的构建工具平台。以下是它的主要特点：

1. 快速转换：能在几分钟内将网页应用转换为桌面应用[^1]

2. 跨平台支持：
   - 支持 Windows、Mac 和 Linux 三大主流操作系统
   - 可以一次构建，生成所有平台的安装包[^5]

3. 使用方式：
   - 提供了 ToDesktop Builder 桌面应用程序
   - 通过步骤引导的方式帮助用户完成转换过程[^2]

4. 商业模式：
   - 个人使用或测试可以免费创建和运行桌面应用
   - 只有当需要为客户创建可分发的应用时才需要付费[^1]

5. 功能特性：
   - 提供原生应用安装程序
   - 包含许多开箱即用的高级功能
   - 支持构建简单到复杂的桌面应用[^3]

ToDesktop 特别适合以下场景：
- 想要快速将现有 Web 应用转换为桌面应用的开发者
- 需要跨平台桌面应用分发的团队
- 希望节省开发时间和精力的项目[^3]

这是一个非常实用的工具，特别是对于那些已经有了 Web 应用，但想要提供原生桌面应用体验的开发者来说。它简化了将 Web 应用转换为桌面应用的过程，使得开发者可以专注于核心业务功能的开发。

[^1]: [ToDesktop 官网](https://www.todesktop.com/)
[^2]: [ToDesktop 基础介绍](https://www.todesktop.com/docs/introduction/basics)
[^3]: https://prod.todesktop.com/
[^4]: https://www.todesktop.com/docs/introduction/ui-concepts
[^5]: https://www.todesktop.com/features/app-installers
`;

export default () => {
  return <Markdown enableCustomFootnotes>{code}</Markdown>;
};
