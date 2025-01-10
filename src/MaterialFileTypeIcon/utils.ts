import iconMap from './icon-map.json';
import type { FileExtensionsKey, FileNamesKey, FolderNamesKey, IconDefinitionsKey } from './types';

function getFileExtension(fileName: string): string {
  return fileName.slice(Math.max(0, fileName.lastIndexOf('.') + 1));
}

function getFileSuffix(fileName: string): FileExtensionsKey {
  return fileName.slice(fileName.indexOf('.') + 1) as FileExtensionsKey;
}

export function filenameFromPath(path: string): string {
  const segments = path.split('/');
  return segments.at(-1) ?? path;
}

export function getIconNameForFileName(fileName: string): IconDefinitionsKey {
  return (iconMap.fileNames[fileName as FileNamesKey] ??
    iconMap.fileNames[fileName.toLowerCase() as FileNamesKey] ??
    iconMap.fileExtensions[getFileSuffix(fileName)] ??
    iconMap.fileExtensions[getFileExtension(fileName) as FileExtensionsKey] ??
    (fileName.endsWith('.html') ? 'html' : null) ??
    (fileName.endsWith('.ts') ? 'typescript' : null) ??
    (fileName.endsWith('.js') ? 'javascript' : null) ??
    'file') as IconDefinitionsKey;
}

export function getIconNameForDirectoryName(dirName: string): IconDefinitionsKey {
  return (iconMap.folderNames[dirName as FolderNamesKey] ??
    iconMap.folderNames[dirName.toLowerCase() as FolderNamesKey] ??
    'folder') as IconDefinitionsKey;
}

export function getIconForFilePath(path: string) {
  const fileName = filenameFromPath(path);
  return getIconNameForFileName(fileName);
}

export function getIconForDirectoryPath(path: string) {
  const dirName = filenameFromPath(path);
  return getIconNameForDirectoryName(dirName);
}

export function getIconUrlByName(
  iconName: IconDefinitionsKey,
  iconsUrl: string,
  open?: boolean,
): string {
  return `${iconsUrl}/${iconName.toString()}${open ? '-open' : ''}.svg`;
}

export function getIconUrlForFilePath({
  path,
  iconsUrl,
  fallbackUnknownType,
}: {
  fallbackUnknownType: boolean;
  iconsUrl: string;
  path: string;
}): string {
  const iconName = getIconForFilePath(path);
  if (fallbackUnknownType && iconName === 'file') return '';
  return getIconUrlByName(iconName, iconsUrl);
}

export function getIconUrlForDirectoryPath({
  path,
  iconsUrl,
  open,
  fallbackUnknownType,
}: {
  fallbackUnknownType: boolean;
  iconsUrl: string;
  open?: boolean;
  path: string;
}): string {
  const iconName = getIconForDirectoryPath(path);
  if (fallbackUnknownType && iconName === 'folder') return '';
  return getIconUrlByName(iconName, iconsUrl, open);
}
