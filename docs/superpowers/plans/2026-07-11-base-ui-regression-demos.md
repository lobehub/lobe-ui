# Base UI Regression Demos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five component-local, interactive Dumi demos that make the regressions fixed by PR #560 directly verifiable.

**Architecture:** Each regression receives one focused TSX demo colocated with its base-ui component. Component `index.md` files register the demos as independent sections; local React state exposes externally observable results without application fixtures or network calls.

**Tech Stack:** React 19, TypeScript, Dumi code demos, `@lobehub/ui`, `@lobehub/ui/base-ui`.

## Global Constraints

- Each Case 2–6 has an independent demo.
- Demos must be manually decidable from visible state.
- No external services, authentication fixtures, application modules, or snapshots.
- Existing component behavior and default demos remain unchanged.

---

### Task 1: Switch native form behavior demo

**Files:**

- Create: `src/base-ui/Switch/demos/nativeButton.tsx`
- Modify: `src/base-ui/Switch/index.md`

**Interfaces:**

- Consumes: `Switch`, `Button`, `Flexbox`, and `Text` public components.
- Produces: a Dumi section named `Native Button in Form`.

- [ ] **Step 1: Create the interactive form demo**

Implement a component with `submitCount` state, a form `onSubmit` handler that prevents navigation and increments the counter, a `Switch`, and an explicit `Button htmlType="submit"`. Display `Switch type: button` and the submission count. Toggling the Switch must leave the count unchanged.

- [ ] **Step 2: Register the demo**

Append this section before Atom Components in `src/base-ui/Switch/index.md`:

```md
## Native Button in Form

<code src="./demos/nativeButton.tsx" nopadding></code>
```

- [ ] **Step 3: Verify lint and rendering inputs**

Run: `npx eslint src/base-ui/Switch/demos/nativeButton.tsx`

Expected: exit 0 with no errors.

---

### Task 2: Select clear contract demo

**Files:**

- Create: `src/base-ui/Select/demos/clearValue.tsx`
- Modify: `src/base-ui/Select/index.md`

**Interfaces:**

- Consumes: controlled `Select<string>` with `allowClear` and `onChange`.
- Produces: visible selected value and callback value displays.

- [ ] **Step 1: Create the clear-value demo**

Initialize the selected value to `us-west-2`. Store the latest callback value separately and render it as `undefined`, `null`, or the string value. The Select has two region options and `allowClear`; clearing it must display `Latest onChange value: undefined`.

- [ ] **Step 2: Register the demo**

Add a `Clear Value Contract` section to `src/base-ui/Select/index.md` pointing to `./demos/clearValue.tsx`.

- [ ] **Step 3: Verify lint**

Run: `npx eslint src/base-ui/Select/demos/clearValue.tsx`

Expected: exit 0 with no errors.

---

### Task 3: Select ReactNode search demo

**Files:**

- Create: `src/base-ui/Select/demos/reactNodeSearch.tsx`
- Modify: `src/base-ui/Select/index.md`

**Interfaces:**

- Consumes: `Select` options with ReactNode `label`, visible string `title`, and opaque string `value`.
- Produces: a searchable Select that resolves `Claude Code` by visible title.

- [ ] **Step 1: Create the search demo**

Define two options whose labels contain icons and text, titles are `Lobe AI` and `Claude Code`, and values are opaque IDs. Render `Select showSearch` plus an instruction to search for `Claude`; selection state is displayed below.

- [ ] **Step 2: Register the demo**

Add a `ReactNode Label Search` section to `src/base-ui/Select/index.md` pointing to `./demos/reactNodeSearch.tsx`.

- [ ] **Step 3: Verify lint**

Run: `npx eslint src/base-ui/Select/demos/reactNodeSearch.tsx`

Expected: exit 0 with no errors.

---

### Task 4: Select closed-popup tags demo

**Files:**

- Create: `src/base-ui/Select/demos/closedTags.tsx`
- Modify: `src/base-ui/Select/index.md`

**Interfaces:**

- Consumes: controlled `Select<string>` with `mode="tags"`, `open={false}`, and token separators.
- Produces: visible tag-array state.

- [ ] **Step 1: Create the tags demo**

Render a controlled tags Select with `open={false}`, placeholder `Type a tag and press Enter`, and separators for comma, Chinese comma, and space. Display the current array as JSON below the control.

- [ ] **Step 2: Register the demo**

Add a `Tags with Closed Popup` section to `src/base-ui/Select/index.md` pointing to `./demos/closedTags.tsx`.

- [ ] **Step 3: Verify lint**

Run: `npx eslint src/base-ui/Select/demos/closedTags.tsx`

Expected: exit 0 with no errors.

---

### Task 5: Tabs implicit initial selection demo

**Files:**

- Create: `src/base-ui/Tabs/demos/implicitDefault.tsx`
- Modify: `src/base-ui/Tabs/index.md`

**Interfaces:**

- Consumes: vertical `Tabs` with no `activeKey` or `defaultActiveKey`.
- Produces: an initially visible first-enabled panel.

- [ ] **Step 1: Create the initial-selection demo**

Define a disabled first item followed by `Arguments` and `Response`. Render vertical Tabs without an explicit initial key and state in the instruction that `Arguments panel` must be visible immediately.

- [ ] **Step 2: Register the demo**

Add an `Implicit Initial Selection` section to `src/base-ui/Tabs/index.md` pointing to `./demos/implicitDefault.tsx`.

- [ ] **Step 3: Verify lint**

Run: `npx eslint src/base-ui/Tabs/demos/implicitDefault.tsx`

Expected: exit 0 with no errors.

---

### Task 6: Integrated verification and PR update

**Files:**

- Verify all files created and modified by Tasks 1–5.

**Interfaces:**

- Consumes: all five Dumi registrations and existing component regression tests.
- Produces: a pushed commit on `codex/fix-base-ui-migration-regressions`.

- [ ] **Step 1: Run targeted regression tests**

Run: `npm test -- --run src/base-ui/Select/__tests__ src/base-ui/Switch/__tests__/Switch.test.tsx src/base-ui/Tabs/__tests__/Tabs.test.tsx src/hooks/useNativeButton.test.tsx`

Expected: 6 test files and 6 tests pass.

- [ ] **Step 2: Run static verification**

Run: `npm run type-check && npx eslint src/base-ui/Select/demos/*.tsx src/base-ui/Switch/demos/*.tsx src/base-ui/Tabs/demos/*.tsx`

Expected: type-check exits 0; lint reports no errors in new demos.

- [ ] **Step 3: Build documentation and packages**

Run: `npm run docs:build && npm run build`

Expected: both commands exit 0 and all referenced Dumi demos resolve.

- [ ] **Step 4: Commit and push**

```bash
git add src/base-ui/Select/demos src/base-ui/Select/index.md src/base-ui/Switch/demos src/base-ui/Switch/index.md src/base-ui/Tabs/demos src/base-ui/Tabs/index.md docs/superpowers/plans/2026-07-11-base-ui-regression-demos.md
git commit -m "📚 docs: add base UI regression demos"
git push
```
