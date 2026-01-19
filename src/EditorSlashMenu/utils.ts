import type { EditorSlashMenuGroup, EditorSlashMenuOption } from './type';

export const isGroup = (
  entry: EditorSlashMenuOption | EditorSlashMenuGroup,
): entry is EditorSlashMenuGroup =>
  Boolean(
    (entry as EditorSlashMenuGroup).items && Array.isArray((entry as EditorSlashMenuGroup).items),
  );

export const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') {
    return (
      !(target as HTMLInputElement | HTMLTextAreaElement).readOnly &&
      !(target as HTMLInputElement | HTMLTextAreaElement).disabled
    );
  }
  return target.getAttribute('role') === 'textbox';
};
