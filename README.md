<a name="readme-top"></a>

<div align="center">

<img width="160" src="https://npm.elemecdn.com/@lobehub/assets-logo/assets/logo-3d.webp">

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

####

</details>

## 📦 Installation

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

To install Lobe UI, run the following command:

```bash
pnpm add @lobehub/ui
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

> 📊 Total: <kbd>**5**</kbd>

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
<a href="https://github.com/meganjohnson96" title="meganjohnson96">
  <img src="https://avatars.githubusercontent.com/u/136729222?v=4" width="50" />
</a>

<!-- CONTRIBUTION END -->

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

#### 📝 License

Copyright © 2023 [LobeHub][profile-url]. <br />
This project is [MIT](./LICENSE) licensed.

<!-- LINK GROUP -->

[profile-url]: https://github.com/lobehub
[gitpod-url]: https://gitpod.io/#https://github.com/lobehub/lobe-ui

<!-- SHIELD LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square

<!-- release -->

[release-shield]: https://img.shields.io/npm/v/@lobehub/ui?label=%F0%9F%A4%AF%20NPM
[release-url]: https://www.npmjs.com/package/@lobehub/ui

<!-- releaseDate -->

[release-date-shield]: https://img.shields.io/github/release-date/lobehub/lobe-ui?style=flat
[release-date-url]: https://github.com/lobehub/lobe-ui/releases

<!-- ciTest -->

[ci-test-shield]: https://github.com/lobehub/lobe-ui/workflows/Test%20CI/badge.svg
[ci-test-url]: https://github.com/lobehub/lobe-ui/actions?query=workflow%3ATest%20CI

<!-- ciRelease -->

[ci-release-shield]: https://github.com/lobehub/lobe-ui/workflows/Release%20CI/badge.svg
[ci-release-url]: https://github.com/lobehub/lobe-ui/actions?query=workflow%3ARelease%20CI

<!-- contributors -->

[contributors-shield]: https://img.shields.io/github/contributors/lobehub/lobe-ui.svg?style=flat
[contributors-url]: https://github.com/lobehub/lobe-ui/graphs/contributors

<!-- forks -->

[forks-shield]: https://img.shields.io/github/forks/lobehub/lobe-ui.svg?style=flat
[forks-url]: https://github.com/lobehub/lobe-ui/network/members

<!-- stargazers -->

[stargazers-shield]: https://img.shields.io/github/stars/lobehub/lobe-ui.svg?style=flat
[stargazers-url]: https://github.com/lobehub/lobe-ui/stargazers

<!-- issues -->

[issues-shield]: https://img.shields.io/github/issues/lobehub/lobe-ui.svg?style=flat
[issues-url]: https://github.com/lobehub/lobe-ui/issues/new/choose
