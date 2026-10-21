<a name="readme-top"></a>

<div align="center">

![](https://github.com/user-attachments/assets/5b9a9b31-2560-4470-a80d-9dd5756b22e0)

<h1>Lobe UI</h1>

<h3>The React UI Kit for AI-Native Web Apps</h3>

LobeHub's open-source React component library for building AI chat and AIGC web apps.

[Documents](https://ui.lobehub.com) · [Changelog](./CHANGELOG.md) · [Report Bug][github-issues-link] · [Request Feature][github-issues-link]

<!-- SHIELD GROUP -->

[![][npm-release-shield]][npm-release-link]
[![][vercel-shield]][vercel-link]
[![][discord-shield]][discord-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-releasedate-shield]][github-releasedate-link]
[![][github-action-test-shield]][github-action-test-link]
[![][github-action-release-shield]][github-action-release-link]<br/>
[![][github-contributors-shield]][github-contributors-link]
[![][github-forks-shield]][github-forks-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]
[![][github-license-shield]][github-license-link]

</div>

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [✨ Why Lobe UI?](#-why-lobe-ui)
- [🚀 Getting Started](#-getting-started)
- [🤖 AI-Powered Development](#-ai-powered-development)
- [📦 Entry Points](#-entry-points)
- [📖 Documentation](#-documentation)
- [💬 Community](#-community)
- [⌨️ Local Development](#️-local-development)
- [🤝 Contributing](#-contributing)
- [🩷 Sponsor](#-sponsor)
- [🔗 Links](#-links)

####

</details>

## ✨ Why Lobe UI?

Lobe UI is the React component library behind LobeHub, made for building AI chat and AIGC web apps.

- **Built for AI apps**: render LLM output (Markdown, code, Mermaid diagrams, diffs, HTML previews) and ship chat interfaces without building them from scratch.
- **From landing page to admin console**: one design language across chat, dashboards, data tables, forms and marketing pages.
- **Theme in one line**: light and dark modes plus primary and neutral colors switch with a single attribute, with no flash on first load.
- **Easy to restyle**: stable class names let you override any component with plain CSS or Tailwind.
- **Ready for global users**: English and Simplified Chinese texts included.
- **AI-native docs**: coding agents read every component's usage and props through [skills.md](https://ui.lobehub.com/skills.md) and [llms.txt](https://ui.lobehub.com/llms.txt).

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🚀 Getting Started

[![][pnpm-shield]][pnpm-link]

```bash
$ pnpm add @lobehub/ui @lobehub/icons @lobehub/fluent-emoji motion
```

Lobe UI is ESM only and needs React 19, `motion` 13 or 14, `@lobehub/icons` 6 and `@lobehub/fluent-emoji` 5 as peer dependencies.

```tsx
import '@lobehub/ui/theme.css';
import '@lobehub/ui/style.css';

import { Button, ConfigProvider } from '@lobehub/ui';
import { motion } from 'motion/react';

export default () => (
  <ConfigProvider motion={motion}>
    <Button type="primary">Hello AIGC</Button>
  </ConfigProvider>
);
```

Theming, i18n, CSS layers and framework setup are covered in the [documentation](https://ui.lobehub.com). Upgrading from 5.x? v6 drops Ant Design; follow the [v6 migration guide](https://ui.lobehub.com/migration-v6).

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤖 AI-Powered Development

Lobe UI's docs are generated for coding agents as well as people.

| Resource                                                                                                 | What it does                                                                                                   |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [skills.md](https://ui.lobehub.com/skills.md)                                                            | Agent skill entry point with a Markdown reference (usage, props, API) for every component                      |
| [llms.txt](https://ui.lobehub.com/llms.txt)                                                              | Page index with outlines for [llms.txt](https://llmstxt.org)-aware tools                                       |
| [v6 migration skill](https://github.com/lobehub/lobe-ui/tree/master/.agents/skills/lobe-ui-v6-migration) | `npx skills add lobehub/lobe-ui`: lets your agent upgrade a 5.x app                                            |
| [Codemod](https://github.com/lobehub/lobe-ui/tree/master/packages/codemod)                               | `npx @lobehub/ui-codemod@latest v6 . --dry`: rewrites v5 code and writes a JSON report agents can work through |

Paste this into Cursor, Claude Code, Codex or any other coding agent:

```text
Read https://ui.lobehub.com/skills.md, then use @lobehub/ui to build a chat page with a message list and an input box. Only use components, props and imports documented there.
```

Works with Cursor, Claude Code, Windsurf, GitHub Copilot and other llms.txt-aware tools.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 📦 Entry Points

| Entry                                                                | Purpose                                    |
| -------------------------------------------------------------------- | ------------------------------------------ |
| `@lobehub/ui`                                                        | Core components, `ConfigProvider`, theming |
| `@lobehub/ui/chat`, `@lobehub/ui/mobile`                             | Chat and mobile UI                         |
| `@lobehub/ui/dashboard`, `@lobehub/ui/pro-table`, `@lobehub/ui/form` | Admin consoles, data tables, forms         |
| `@lobehub/ui/awesome`, `@lobehub/ui/brand`, `@lobehub/ui/mdx`        | Landing pages, LobeHub brand, MDX docs     |
| `@lobehub/ui/icons`, `@lobehub/ui/i18n`                              | Platform icons, locale bundles             |

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 📖 Documentation

- **Docs and live demos**: [ui.lobehub.com](https://ui.lobehub.com)
- **Migrating to v6**: [ui.lobehub.com/migration-v6](https://ui.lobehub.com/migration-v6)
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 💬 Community

Questions, ideas and showcases are all welcome:

- [Discord][discord-link]
- [GitHub Discussions](https://github.com/lobehub/lobe-ui/discussions)
- [GitHub Issues][github-issues-link]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ Local Development

You can use Github Codespaces for online development:

[![][codespaces-shield]][codespaces-link]

Or clone it for local development (Node.js >= 22.22 and pnpm):

```bash
$ git clone https://github.com/lobehub/lobe-ui.git
$ cd lobe-ui
$ pnpm install
$ pnpm start
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤝 Contributing

Contributions of all types are more than welcome, if you are interested in contributing code, feel free to check out our GitHub [Issues][github-issues-link] to get stuck in to show us what you’re made of.

[![][pr-welcome-shield]][pr-welcome-link]

[![][contributors-contrib]][contributors-link]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🩷 Sponsor

Every bit counts and your one-time donation sparkles in our galaxy of support! You're a shooting star, making a swift and bright impact on our journey. Thank you for believing in us – your generosity guides us toward our mission, one brilliant flash at a time.

<a href="https://opencollective.com/lobehub" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/lobehub/.github/blob/main/static/sponsor-dark.png?raw=true">
    <img  src="https://github.com/lobehub/.github/blob/main/static/sponsor-light.png?raw=true">
  </picture>
</a>

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🔗 Links

- **[🍭 Lobe UI](https://github.com/lobehub/lobe-ui)** - React component library for AI apps
- **[🥨 Lobe Icons](https://github.com/lobehub/lobe-icons)** - AI / LLM brand logos and icons
- **[📊 Lobe Charts](https://github.com/lobehub/lobe-charts)** - React chart components
- **[✒️ Lobe Editor](https://github.com/lobehub/lobe-editor)** - Lexical-based rich text editor for React, with Markdown, plugins and a chat composer
- **[🎤 Lobe TTS](https://github.com/lobehub/lobe-tts)** - TTS / STT speech library
- **[📐 Lobe Lint](https://github.com/lobehub/lobe-lint)** - ESLint, Prettier, Stylelint, Commitlint and more lint configs
- **[😀 Fluent Emoji](https://github.com/lobehub/fluent-emoji)** - Fluent Emoji assets

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

<details><summary><h4>📝 License</h4></summary>

[![][fossa-license-shield]][fossa-license-link]

</details>

Copyright © 2023 [LobeHub][profile-link]. <br />
This project is [MIT](./LICENSE) licensed.

<!-- LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
[banner]: https://github-production-user-asset-6210df.s3.amazonaws.com/17870709/268452017-960ab8a1-e4b7-4648-beb1-77daf4b6034a.png
[pnpm-link]: https://pnpm.io
[pnpm-shield]: https://img.shields.io/badge/-pnpm-F69220?logo=pnpm&style=for-the-badge
[codespaces-link]: https://codespaces.new/lobehub/lobe-ui
[codespaces-shield]: https://github.com/codespaces/badge.svg
[contributors-contrib]: https://contrib.rocks/image?repo=lobehub/lobe-ui
[contributors-link]: https://github.com/lobehub/lobe-ui/graphs/contributors
[discord-link]: https://discord.gg/AYFPHvv2jT
[discord-shield]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=flat-square
[fossa-license-link]: https://app.fossa.com/projects/git%2Bgithub.com%2Flobehub%2Flobe-ui
[fossa-license-shield]: https://app.fossa.com/api/projects/git%2Bgithub.com%2Flobehub%2Flobe-ui.svg?type=large
[github-action-release-link]: https://github.com/lobehub/lobe-ui/actions/workflows/release.yml
[github-action-release-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/lobe-ui/release.yml?label=release&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-action-test-link]: https://github.com/lobehub/lobe-ui/actions/workflows/test.yml
[github-action-test-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/lobe-ui/test.yml?label=test&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-contributors-link]: https://github.com/lobehub/lobe-ui/graphs/contributors
[github-contributors-shield]: https://img.shields.io/github/contributors/lobehub/lobe-ui?color=c4f042&labelColor=black&style=flat-square
[github-forks-link]: https://github.com/lobehub/lobe-ui/network/members
[github-forks-shield]: https://img.shields.io/github/forks/lobehub/lobe-ui?color=8ae8ff&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/lobehub/lobe-ui/issues
[github-issues-shield]: https://img.shields.io/github/issues/lobehub/lobe-ui?color=ff80eb&labelColor=black&style=flat-square
[github-license-link]: https://github.com/lobehub/lobe-ui/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-ui?color=white&labelColor=black&style=flat-square
[github-releasedate-link]: https://github.com/lobehub/lobe-ui/releases
[github-releasedate-shield]: https://img.shields.io/github/release-date/lobehub/lobe-ui?labelColor=black&style=flat-square
[github-stars-link]: https://github.com/lobehub/lobe-ui/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/lobehub/lobe-ui?color=ffcb47&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/ui
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/ui?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/ui
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/ui?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[pr-welcome-link]: https://github.com/lobehub/lobe-ui/pulls
[pr-welcome-shield]: https://img.shields.io/badge/🤯_pr_welcome-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[profile-link]: https://github.com/lobehub
[vercel-link]: https://ui.lobehub.com
[vercel-shield]: https://img.shields.io/website?down_message=offline&label=vercel&labelColor=black&logo=vercel&style=flat-square&up_message=online&url=https%3A%2F%2Fui.lobehub.com
