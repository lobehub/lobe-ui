const scopeLog = (globalThis.__lobeDemoEmptyImportLog ??= []);

scopeLog.push('empty-import-helper');

export const loadEmptyImportDependency = async () => import('./helper.js');
