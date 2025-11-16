# Figma to Lucide Extra Icons Script

This script converts icons from Figma to Lucide-style React components.

## Prerequisites

1. Set up your Figma access token:

   ```bash
   export FIGMA_ACCESS_TOKEN="your-figma-token-here"
   ```

   Or add it to your `.env` file:

   ```
   FIGMA_ACCESS_TOKEN=your-figma-token-here
   ```

   You can get your token from: <https://www.figma.com/developers/api#access-tokens>

## Usage

Run the script from the project root:

```bash
npm run gen:lucide-extra
```

Or directly with tsx:

```bash
tsx ./scripts/icons-lucide-extra/index.ts
```

## What it does

1. Fetches the Figma file: `https://www.figma.com/design/aHzK4vQNj8KpuK7nMOWDp3/lucide-extra`
2. Looks for the page named "extra"
3. Extracts all icons (frames/components) from that page
4. Downloads SVG representations of each icon
5. Converts them to Lucide-style React components using `createLucideIcon`
6. Saves them to `src/icons/lucideExtra/`
7. Updates the `index.ts` file with exports

## Output Format

Each icon is converted to a component like:

```typescript
import { createLucideIcon } from 'lucide-react';

const IconNameIcon = createLucideIcon('Icon Name', [
  [
    'path',
    {
      d: 'M19 10a7 7 0 10-14 0...',
      key: '1',
    },
  ],
]);

IconNameIcon.displayName = 'IconNameIcon';

export default IconNameIcon;
```

## Figma Requirements

- The Figma file must have a page named "extra" (case-insensitive)
- Each icon should be a Frame or Component on that page
- Icon names in Figma will be converted to PascalCase with "Icon" suffix
  - Example: "Globe Off" → "GlobeOffIcon"
