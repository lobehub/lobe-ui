---
nav: Brand
group: Spline
title: LogoThree
description: A 3D interactive logo component that renders a Spline-based 3D model of the LobeHub logo with a fallback image while loading.
apiHeader:
  pkg: '@lobehub/ui/brand'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/brand/LogoThree/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/brand/LogoThree/index.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Spline

<code src="./demos/LogoSpline.tsx" nopadding></code>

## APIs

| Property  | Description                                       | Type                       | Default |
| --------- | ------------------------------------------------- | -------------------------- | ------- |
| size      | The size of the logo in pixels                    | `number`                   | `128`   |
| className | CSS class name                                    | `string`                   | -       |
| style     | Inline style object                               | `CSSProperties`            | -       |
| onLoad    | Callback function when the Spline model is loaded | `(splineApp: any) => void` | -       |

Additionally, this component also accepts all properties from the Spline component.
