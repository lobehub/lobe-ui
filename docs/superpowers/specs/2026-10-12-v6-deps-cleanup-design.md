# v6 dependency cleanup (sub-project A)

Date: 2026-10-12
Branch: commits directly on `v6` (lands in #706 before 6.0.0 stable)
Discussion doc: https://claude.ai/code/artifact/00ce03fa-5ca9-4207-8c03-a8d3465813bb

## Goal

Every runtime dependency of `@lobehub/ui` is imported by library source and does not duplicate one we already ship. Everything that can move to latest does. Sub-project B (render granularity) starts after this lands, so it measures against the post-A tree.

Success:

- The zero-import scan (below) prints nothing for `dependencies`.
- `pnpm ci`, `pnpm vitest run` and `pnpm build` pass.
- Demos of every touched component render unchanged (local-testing skill).
- Consumer footprint is measured before and after and recorded in the final commit body.

## Decisions

| #   | Question                                                | Decision                                                |
| --- | ------------------------------------------------------- | ------------------------------------------------------- |
| 1   | Scope                                                   | Prune + consolidate + bump; breaking is fine in a major |
| 2   | Heavy single-component deps → optional peers            | **Deferred.** Peer deps don't change in this round      |
| 3   | Data-fetching libs                                      | None in the UI lib; `swr` is removed                    |
| 4   | Blocked majors (TS 7, stylelint 17, jsdom 30, Spline 2) | On hold; not part of this round                         |
| 5   | How it lands                                            | One commit per step below, directly on `v6`             |

## A1 Prune

Remove from root `dependencies`. None has an import in `src/` outside demos and tests.

| Dep                                                                                                                                                                                                                                                              | Destination                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `@emotion/is-prop-valid`, `@mdx-js/react`, `@radix-ui/react-slot`, `class-variance-authority`, `emoji-mart`, `hast-util-to-jsx-runtime`, `html-url-attributes`, `marked`, `query-string`, `react-rnd`, `react-zoom-pan-pinch`, `remark-github`, `remend`, `uuid` | Removed                                                                                                                      |
| `remark-parse`, `remark-rehype`                                                                                                                                                                                                                                  | Root `devDependencies` (used by `src/Markdown/plugins/rehypeKatex.test.ts`); `remark-parse` is already a docs-kit dependency |

`packages/docs-kit/vite.config.ts` lists `ahooks`, `polished`, `react-merge-refs`, `remark-parse` and `remark-rehype` in `runtimeOptimizeDeps`. The list is filtered by resolvability, so nothing breaks, but entries for removed deps are deleted in the same commit that removes the dep.

## A2 Consolidate

| Dep                  | Call sites                                                                                                             | Replacement                                                                                                                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `use-merge-value`    | 24 files, imported as `useControlledState` / `useMergeState`                                                           | `src/hooks/useControlledState.ts`, same call signature `(default, { defaultValue, value, onChange })`, so call sites only change the import                                                                                                   |
| `react-merge-refs`   | 15 files, `mergeRefs` and `useMergeRefs`                                                                               | `src/utils/mergeRefs.ts` (`mergeRefs`, `useMergeRefs`); returns a React 19 ref callback that returns a cleanup                                                                                                                                |
| `ahooks`             | `useScroll` (chat/BackBottom), `useSize` (mobile/ChatInputArea, awesome/GridBackground), `useHover` (DraggableSideNav) | Removed from the whole repo (owner: don't keep this lib). `src/hooks/useScroll.ts`, `useSize.ts` (ResizeObserver), `useHover.ts`; `BackBottom`'s public `target` prop keeps accepting an element, a getter or a ref via a local `Target` type |
| `polished`           | `mix`, `parseToRgb` (styles/theme/token/neutral.ts), `rgba` (awesome/Giscus, awesome/GridBackground)                   | `chroma-js`: `chroma.mix`, `.rgb()`, `.alpha().css()`. Token output must stay byte-identical (snapshot the generated neutral tokens before the change)                                                                                        |
| `fast-deep-equal`    | chat/EditableMessageList, FormKit/engine/tanstack.ts                                                                   | Existing `src/utils/isDeepEqual.ts`                                                                                                                                                                                                           |
| `@floating-ui/react` | Type-only: `VirtualElement` (ContextMenu/store.ts), `Placement` (utils/placement.ts)                                   | Local type definitions                                                                                                                                                                                                                        |
| `swr`                | EmojiPicker locale JSON import                                                                                         | Module-level `Map<locale, Promise>` cache plus `useEffect` state; the picker keeps rendering with default strings until the locale resolves, as it does today                                                                                 |
| `url-join`           | utils/genCdnUrl.ts                                                                                                     | Native string join; the existing `genCdnUrl.test.ts` must pass unchanged                                                                                                                                                                      |
| `numeral`            | chat/TokenTag                                                                                                          | `Intl.NumberFormat` with the same output for the demo values                                                                                                                                                                                  |
| `ts-md5`             | hooks/useHighlight.ts cache key                                                                                        | A small non-crypto string hash in `src/utils`; the key only needs to be stable within a session                                                                                                                                               |
| `immer`              | chat/EditableMessageList/messageReducer.ts                                                                             | Plain immutable updates                                                                                                                                                                                                                       |

Kept on purpose: `dayjs` (DatePicker's calendar logic; date-fns was evaluated and put on hold because downstream passes dayjs format tokens and relies on the global dayjs locale), `@emotion/*` (downstream `createStaticStyles` API), `shiki` and `katex` (core of Markdown and Highlighter), `es-toolkit`.

## A4 Version bumps

1. Bump every minor and patch in root, `packages/docs-kit` and `packages/codemod`.
2. `katex` 0.18 → 0.19, `virtua` 0.52 → 0.53 and `react-avatar-editor` 15 → 16: read each changelog, adapt call sites, one commit each.

## A5 Keep them out

`eslint.config.mjs` gets a `no-restricted-imports` `paths` entry for every package removed in A1 and A2, scoped to `src/**` and `packages/**`, each with a message naming the replacement (for `ahooks`: "use the hooks in src/hooks"). If `@lobehub/eslint-config` already sets `no-restricted-imports`, the entry merges with its paths instead of replacing them.

## Verification

- Zero-import scan: for each key in `dependencies`, grep `src/` (excluding `demos/` and `*.test.*`) for `from '<dep>'`, `from '<dep>/…'` and `import('<dep>…')`; expect no misses.
- Footprint: `pnpm pack` on the pre-A commit and on the final commit, install each tarball into an empty project with the v6 peers, compare `du -sh node_modules` and the package count.
- `pnpm ci`, `pnpm vitest run`, `pnpm build` (includes the StyleX build check).
- Local-testing skill on the demos of every component touched in A2: SearchBar, Tabs, Tree, Drawer, Tooltip, BackBottom, ChatInputArea, GridBackground, DraggableSideNav, Giscus, EditableMessageList, FormKit, ContextMenu, EmojiPicker, TokenTag, Highlighter, plus the theme tokens in light and dark.

## Migration guide

No export changes, so no codemod rule. `docs/migration-v6.mdx` gets one line: apps that imported any removed package without declaring it themselves (for example `ahooks`, `swr`, `polished`, `uuid`) must add it to their own `package.json`.

## Commit order

1. `➖ chore(deps): drop unused runtime dependencies` (A1)
2. One `♻️ refactor(...)` + `➖` commit per A2 row, smallest first: `@floating-ui/react`, `fast-deep-equal`, `url-join`, `numeral`, `ts-md5`, `immer`, `swr`, `polished`, `ahooks`, `react-merge-refs`, `use-merge-value`
3. `⬆️ chore(deps): bump minors and patches` then one commit each for `katex`, `virtua`, `react-avatar-editor`
4. `🔧 chore(eslint): ban imports of removed dependencies` (A5 below)
5. `📝 docs(migration): note dependencies no longer installed by @lobehub/ui`

## Out of scope

- Optional peers for heavy single-component deps (deferred, see decision 2).
- TypeScript 7, stylelint 17, jsdom 30, `@splinetool/runtime` 2 (on hold).
- Render granularity work (sub-project B, its own spec).
