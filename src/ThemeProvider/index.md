---
nav: Components
group: Theme
title: ThemeProvider
description: ThemeProvider is a component that provides a theme to all the child components. It supports theme customization, custom stylish objects, and font loading.
---

## Default

<code src="./demos/index.tsx" center></code>

## Custom Fonts

<code src="./demos/CustomFonts.tsx" center></code>

## APIs

### ThemeProvider

| Property          | Description                            | Type                                                             | Default                         |
| ----------------- | -------------------------------------- | ---------------------------------------------------------------- | ------------------------------- |
| children          | Child elements                         | `ReactNode`                                                      | -                               |
| className         | Custom class name                      | `string`                                                         | -                               |
| customFonts       | Custom font URLs to load               | `string[]`                                                       | Default Lobe webfonts and KaTeX |
| customStylish     | Customize stylish objects              | `(theme: CustomStylishParams) => { [key: string]: any }`         | -                               |
| customTheme       | Customize theme colors                 | `{ neutralColor?: NeutralColors; primaryColor?: PrimaryColors }` | -                               |
| customToken       | Customize theme tokens                 | `(theme: CustomTokenParams) => { [key: string]: any }`           | -                               |
| enableCustomFonts | Whether to enable custom fonts loading | `boolean`                                                        | `true`                          |
| enableGlobalStyle | Whether to enable global style         | `boolean`                                                        | `true`                          |
| style             | Custom style object                    | `CSSProperties`                                                  | -                               |

ThemeProvider inherits all properties from antd-style's ThemeProvider component, including the common appearance-related properties.

### ThemeProvider Features

The ThemeProvider component provides several key features:

1. **Theming**: Provides consistent theming across components with automatic light/dark mode support
2. **Global Styles**: Applies base styles including font settings and scrollbar styling
3. **Font Loading**: Automatically loads Lobe's custom webfonts
4. **Style Extensions**: Adds utility styles like blur effects, gradients, and animations
5. **Component Styling**: Enhances Ant Design components with Lobe UI styling

### Customization

The ThemeProvider allows for extensive customization:

```tsx
import { ThemeProvider } from '@lobehub/ui';

export default () => (
  <ThemeProvider
    customTheme={{
      // Customize primary colors
      primaryColor: {
        primary: '#1677ff',
      },
      // Customize neutral colors
      neutralColor: {
        gray: '#666',
      },
    }}
    // Load custom fonts
    customFonts={['https://fonts.googleapis.com/css2?family=Roboto&display=swap']}
  >
    {/* Your application content */}
  </ThemeProvider>
);
```
