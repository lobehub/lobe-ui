import type iconMap from './icon-map.json';

export type IconDefinitionsKey = keyof (typeof iconMap)['iconDefinitions'];
export type FileNamesKey = keyof (typeof iconMap)['fileNames'];
export type FolderNamesKey = keyof (typeof iconMap)['folderNames'];
export type FileExtensionsKey = keyof (typeof iconMap)['fileExtensions'];
