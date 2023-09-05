<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-logo/1.0.0/files/assets/logo-3d.webp">
<img height="120" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/lollipop.webp">

<h1>Lobe UI</h1>

Lobe UI is an open-source UI component library for building _AIGC_ web apps

[Changelog](./CHANGELOG.md) · [Report Bug][issues-url] · [Request Feature][issues-url]

<!-- SHIELD GROUP -->

[![release][release-shield]][release-url]
[![releaseDate][release-date-shield]][release-date-url]
[![ciTest][ci-test-shield]][ci-test-url]
[![ciRelease][ci-release-shield]][ci-release-url] <br/>
[![contributors][contributors-shield]][contributors-url]
[![forks][forks-shield]][forks-url]
[![stargazers][stargazers-shield]][stargazers-url]
[![issues][issues-shield]][issues-url]

![](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

</div>

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [📦 Installation](#-installation)

- [🤯 Usage](#-usage)

  - [Compile with NextJS](#compile-with-nextjs)

- [⌨️ Local Development](#️-local-development)

- [🤝 Contributing](#-contributing)

- [🔗 More Products](#-more-products)

####

</details>

## 📦 Installation

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

To install Lobe UI, run the following command:

```bash
pnpm i -S @lobehub/ui
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤯 Usage

### Compile with NextJS

by work correct with nextjs ssr, add `transpilePackages: ['@lobehub/ui']` to `next.config.js`. For example:

```js
// next.config.js
const nextConfig = {
  // ...other config

  transpilePackages: ['@lobehub/ui'],
};
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ Local Development

You can use Gitpod for online development:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)][gitpod-url]

Or clone it for local development:

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

<!-- CONTRIBUTION GROUP -->

> 📊 Total: <kbd>**6**</kbd>

<a href="https://github.com/canisminor1990" title="canisminor1990">
  <img src="https://avatars.githubusercontent.com/u/17870709?v=4" width="50" />
</a>
<a href="https://github.com/arvinxx" title="arvinxx">
  <img src="https://avatars.githubusercontent.com/u/28616219?v=4" width="50" />
</a>
<a href="https://github.com/apps/dependabot" title="dependabot[bot]">
  <img src="https://avatars.githubusercontent.com/in/29110?v=4" width="50" />
</a>
<a href="https://github.com/actions-user" title="actions-user">
  <img src="https://avatars.githubusercontent.com/u/65916846?v=4" width="50" />
</a>
<a href="https://github.com/Wxh16144" title="Wxh16144">
  <img src="https://avatars.githubusercontent.com/u/32004925?v=4" width="50" />
</a>
<a href="https://github.com/meganjohnson96" title="meganjohnson96">
  <img src="https://avatars.githubusercontent.com/u/136729222?v=4" width="50" />
</a>

<!-- CONTRIBUTION END -->

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🔗 More Products

- **[🤖 Lobe Chat][lobe-chat] :** An open-source, extensible (Function Calling), high-performance chatbot framework. It supports one-click free deployment of your private ChatGPT/LLM web application.
- **[🤯 Lobe Theme][lobe-theme] :** The modern theme for stable diffusion webui, exquisite interface design, highly customizable UI, and efficiency boosting features.
- **[🌏 Lobe i18n][lobe-i18n] :** Lobe i18n is an automation tool for the i18n (internationalization) translation process, powered by ChatGPT. It supports features such as automatic splitting of large files, incremental updates, and customization options for the OpenAI model, API proxy, and temperature.
- **[💌 Lobe Commit][lobe-commit] :** Lobe Commit is a CLI tool that leverages Langchain/ChatGPT to generate Gitmoji-based commit messages.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

#### 📝 License

Copyright © 2023 [LobeHub][profile-url]. <br />
This project is [MIT](./LICENSE) licensed.

<!-- LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
[ci-release-shield]: https://github.com/lobehub/lobe-ui/workflows/Release%20CI/badge.svg
[ci-release-url]: https://github.com/lobehub/lobe-ui/actions?query=workflow%3ARelease%20CI
[ci-test-shield]: https://github.com/lobehub/lobe-ui/workflows/Test%20CI/badge.svg
[ci-test-url]: https://github.com/lobehub/lobe-ui/actions?query=workflow%3ATest%20CI
[contributors-shield]: https://img.shields.io/github/contributors/lobehub/lobe-ui.svg?style=flat
[contributors-url]: https://github.com/lobehub/lobe-ui/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lobehub/lobe-ui.svg?style=flat
[forks-url]: https://github.com/lobehub/lobe-ui/network/members
[gitpod-url]: https://gitpod.io/#https://github.com/lobehub/lobe-ui
[issues-shield]: https://img.shields.io/github/issues/lobehub/lobe-ui.svg?style=flat
[issues-url]: https://github.com/lobehub/lobe-ui/issues/new/choose
[lobe-chat]: https://github.com/lobehub/lobe-chat
[lobe-commit]: https://github.com/lobehub/lobe-commit/tree/master/packages/lobe-commit
[lobe-i18n]: https://github.com/lobehub/lobe-commit/tree/master/packages/lobe-i18n
[lobe-theme]: https://github.com/lobehub/sd-webui-lobe-theme
[profile-url]: https://github.com/lobehub
[release-date-shield]: https://img.shields.io/github/release-date/lobehub/lobe-ui?style=flat
[release-date-url]: https://github.com/lobehub/lobe-ui/releases
[release-shield]: https://img.shields.io/npm/v/@lobehub/ui?label=%F0%9F%A4%AF%20NPM
[release-url]: https://www.npmjs.com/package/@lobehub/ui
[stargazers-shield]: https://img.shields.io/github/stars/lobehub/lobe-ui.svg?style=flat
[stargazers-url]: https://github.com/lobehub/lobe-ui/stargazers
