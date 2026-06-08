import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { PatchDiff } from '../PatchDiff';
import type { PatchDiffProps } from '../type';

const patch = `--- a/src/user.ts
+++ b/src/user.ts
@@ -1,7 +1,13 @@
-export function formatUser(name) {
-  return name.trim();
+export interface User {
+  id: string;
+  name: string;
+}
+
+export function formatUser(name: string): User {
+  return { id: crypto.randomUUID(), name: name.trim() };
 }
 
-export const user = formatUser('Ada');
+export const user = formatUser('Ada');
+console.log(user.id);`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      defaultExpand: true,
      fileName: 'user.ts',
      fullFeatured: true,
      language: 'typescript',
      showHeader: true,
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
      viewMode: {
        options: ['split', 'unified'],
        value: 'split',
      },
    },
    { store },
  ) as PatchDiffProps;

  return (
    <StoryBook levaStore={store}>
      <PatchDiff {...options} patch={patch} />
    </StoryBook>
  );
};
