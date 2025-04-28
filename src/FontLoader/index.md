---
nav: Components
group: Theme
title: FontLoader
description: The FontLoader component is used to load fonts from a provided URL. It creates a link element with the given URL and appends it to the document head. This component is a memoized functional component that uses the `useEffect` hook to ensure that the link element is only created once and appended to the document head when the component mounts.
---

## APIs

| Property | Description                            | Type     | Default |
| -------- | -------------------------------------- | -------- | ------- |
| url      | The URL of the font stylesheet to load | `string` | -       |
