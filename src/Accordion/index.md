---
nav: Components
group: Data Display
title: Accordion
---

Accordion is a vertically stacked set of interactive headings that each contain a title and content. Inspired by HeroUI's Accordion component with smooth motion animations and component composition API.

## Default

<code src="./demos/index.tsx" nopadding></code>

## Simple Example

<code src="./demos/data.tsx" ></code>

## Standalone Item

AccordionItem can be used independently without wrapping in an Accordion component. It supports both controlled and uncontrolled modes.

<code src="./demos/Standalone.tsx" ></code>

## With Action

AccordionItem supports an `action` prop that allows you to add custom action buttons or icons to the header. The action appears on the right side of the header and can be any ReactNode.

<code src="./demos/Action.tsx" ></code>

## APIs

### Accordion Props

| Property            | Description                                                   | Type                                     | Default    |
| ------------------- | ------------------------------------------------------------- | ---------------------------------------- | ---------- |
| variant             | The style variant of the accordion (applied to Block headers) | `'filled' \| 'outlined' \| 'borderless'` | `'filled'` |
| children            | AccordionItem components                                      | `ReactNode`                              | -          |
| accordion           | Only one item can be expanded at a time                       | `boolean`                                | `false`    |
| defaultExpandedKeys | Default expanded keys (uncontrolled)                          | `Key[]`                                  | `[]`       |
| expandedKeys        | Controlled expanded keys                                      | `Key[]`                                  | -          |
| onExpandedChange    | Callback when expanded keys change                            | `(keys: Key[]) => void`                  | -          |
| gap                 | Gap between accordion items                                   | `number`                                 | -          |
| hideIndicator       | Whether to hide the chevron indicator                         | `boolean`                                | `false`    |
| indicatorPlacement  | Indicator placement for all items                             | `'start' \| 'end'`                       | `'start'`  |
| keepContentMounted  | Keep content mounted when collapsed                           | `boolean`                                | `false`    |
| disableAnimation    | Disable animation                                             | `boolean`                                | `false`    |
| showDivider         | Show dividers between items                                   | `boolean`                                | `false`    |
| motionProps         | Motion props for motion animation                             | `object`                                 | -          |
| classNames          | Custom classNames for child elements                          | `{ base?: string }`                      | -          |
| styles              | Custom styles for child elements                              | `{ base?: CSSProperties }`               | -          |

### AccordionItem Props

| Property           | Description                               | Type                                                                             | Default   |
| ------------------ | ----------------------------------------- | -------------------------------------------------------------------------------- | --------- |
| itemKey            | Unique identifier of the panel (required) | `Key`                                                                            | -         |
| title              | Title of the panel                        | `ReactNode`                                                                      | -         |
| children           | Content of the panel                      | `ReactNode`                                                                      | -         |
| action             | Action component (appears on hover)       | `ReactNode`                                                                      | -         |
| disabled           | Whether the item is disabled              | `boolean`                                                                        | `false`   |
| hideIndicator      | Whether to hide the indicator             | `boolean`                                                                        | `false`   |
| indicator          | Custom indicator component or function    | `ReactNode \| ((props: { isOpen: boolean; isDisabled?: boolean }) => ReactNode)` | -         |
| indicatorPlacement | Indicator placement                       | `'start' \| 'end'`                                                               | `'start'` |
| defaultExpand      | Default expanded state (uncontrolled)     | `boolean`                                                                        | -         |
| expand             | Controlled expanded state                 | `boolean`                                                                        | -         |
| onExpandChange     | Callback when expanded state changes      | `(expanded: boolean) => void`                                                    | -         |
| classNames         | Custom classNames for child elements      | See below                                                                        | -         |
| styles             | Custom styles for child elements          | See below                                                                        | -         |

### AccordionItem classNames

| Property  | Description                   | Type     |
| --------- | ----------------------------- | -------- |
| base      | Item container className      | `string` |
| header    | Header container className    | `string` |
| title     | Title text className          | `string` |
| action    | Action container className    | `string` |
| indicator | Indicator container className | `string` |
| content   | Content container className   | `string` |

### AccordionItem styles

| Property  | Description                | Type            |
| --------- | -------------------------- | --------------- |
| base      | Item container styles      | `CSSProperties` |
| header    | Header container styles    | `CSSProperties` |
| title     | Title text styles          | `CSSProperties` |
| action    | Action container styles    | `CSSProperties` |
| indicator | Indicator container styles | `CSSProperties` |
| content   | Content container styles   | `CSSProperties` |

## Standalone Usage

`AccordionItem` can be used independently without wrapping in an `Accordion` component. When used standalone, you can control its expanded state using:

- `defaultExpand`: Set the initial expanded state (uncontrolled mode)
- `expand`: Control the expanded state externally (controlled mode)
- `onExpandChange`: Callback fired when the expanded state changes

When `expand` or `defaultExpand` props are provided, the item will manage its own state independently. Otherwise, it will use the context from the parent `Accordion` component.

## Animation

The Accordion component uses motion for smooth animations. You can customize the animation behavior with the following props:

- `disableAnimation`: Set to `true` to disable all animations
- `keepContentMounted`: Keep content DOM mounted when collapsed (useful for forms)
- `motionProps`: Pass custom motion props to override default animations
