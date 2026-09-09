# common-mistakes.md — @lobehub/ui project layer

Project-specific traps. The generic checklist lives in the skill.

## Checklist

- **P1** A docs-site run proves `src/`, never `es/`. A claim about the shipped
  package needs a consuming-app run against a replaced `es/`.
- **P2** Measure geometry with `offsetWidth`/`offsetHeight` and resting insets.
  `getBoundingClientRect` includes the entrance animation's transform, so a
  ResizeObserver firing mid-flight reports a scaled-down element.
- **P3** A CSS custom property written on `:root` reaches every instance of the
  component on the page. Verify with more than one instance mounted.

## Entries

### P1 — Verifying the source when the claim is about the package

Docs dev and vitest both alias `@lobehub/ui` to `src/`. A geometry or styling
change verified only there has not been proven to survive the build. Run the
consuming app against a replaced `es/` and swap back to the published build to
get an honest `before`.

### P2 — Measuring through a transform

`FloatingPanel` enters with a motion scale. A ResizeObserver fires during that
animation, and `getBoundingClientRect` at that moment returns the scaled box —
an offset derived from it lands short. Layout properties are transform-free.

### P3 — A global custom property is shared state

Two panels on one page both write the same `:root` variable, and the second one
to mount reads the first one's value as its own baseline. Scope a variable that
describes one instance to that instance's own element.
