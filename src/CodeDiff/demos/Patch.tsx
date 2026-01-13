import { PatchDiff } from '../PatchDiff';

const patch = `--- a/src/utils.ts
+++ b/src/utils.ts
@@ -1,10 +1,15 @@
-export function add(a, b) {
-  return a + b;
+export function add(a: number, b: number): number {
+  if (typeof a !== 'number' || typeof b !== 'number') {
+    throw new TypeError('Arguments must be numbers');
+  }
+  return a + b;
 }

-export function subtract(a, b) {
+export function subtract(a: number, b: number): number {
   return a - b;
 }
+
+export function multiply(a: number, b: number): number {
+  return a * b;
+}`;

export default () => {
  return <PatchDiff language="typescript" patch={patch} />;
};
