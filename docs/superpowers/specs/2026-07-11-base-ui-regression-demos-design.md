# Base UI Regression Demos Design

## Objective

Add one interactive documentation demo for each confirmed migration regression fixed by PR #560. The demos provide direct manual verification without requiring the LobeHub application, authentication, or seeded product data.

## Placement

The demos remain next to the component whose contract they verify:

| Case | Component page | Demo behavior                                                                                                                    |
| ---- | -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 2    | Switch         | Render a Switch inside a form and expose its native button type and form submission count                                        |
| 3    | Select         | Select a value, clear it, and display the latest external value including `undefined`                                            |
| 4    | Select         | Search options whose labels are React nodes and whose visible names come from `title`                                            |
| 5    | Select         | Enter tags while `open={false}` and display the resulting tag array                                                              |
| 6    | Tabs           | Render vertical Tabs without an explicit initial key, with the first item disabled, and show the first enabled panel immediately |

Select receives three separate demos because each case verifies an independent public contract. Switch and Tabs each receive one demo. Existing default and atom demos remain unchanged.

## Interaction Design

Each demo includes a short instruction and a visible result area. A reviewer must be able to determine success from the rendered page alone:

- Switch toggling must not submit its surrounding form; an explicit submit action remains available to prove the counter works.
- Select clear must visibly report `undefined`, distinguishing it from `null`.
- ReactNode search must return the expected visible option when its title is entered.
- Tags input must accept Enter and configured separators while the popup is forced closed.
- Tabs must show the first enabled panel on initial render without a preliminary click.

The demos use existing Lobe UI layout and typography components and local React state. They do not call external services or depend on application-specific modules.

## Select Search List Spacing

The ReactNode search demo exposed a missing separation between the popup search field and the first option. When a popup search field is rendered, the Select list receives `4px` of block-start padding. This matches the existing DropdownMenu spacing scale while preserving the search divider and individual option heights.

The spacing is conditional: Select popups without a search field keep their existing list geometry. The inline tags input is not a popup search field and does not activate this padding.

## Alternatives Considered

1. **Component-local demos (selected):** discoverable beside the API and independently reusable during component development.
2. **One consolidated regression page:** convenient for a single verification pass, but disconnected from component documentation and harder to maintain.
3. **Storybook-only fixtures:** suitable for visual regression infrastructure, but this repository already exposes these base-ui components through Dumi documentation.

## Validation

- Run targeted lint over all new demo and documentation registration files.
- Run the existing regression tests for Select, Switch, and Tabs.
- Run TypeScript type checking.
- Run the complete documentation/package build to confirm every Dumi code block resolves.

## Non-goals

- Reproducing LobeHub application screens or product data.
- Adding network requests, authentication fixtures, or visual snapshot tests.
- Changing the component fixes already included in PR #560.
- Changing popup spacing for Select instances without a search field.
