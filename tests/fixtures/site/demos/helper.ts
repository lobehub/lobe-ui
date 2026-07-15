const scopeLog = ((globalThis as any).__lobeDemoScopeLog ??= []);

scopeLog.push('helper');

export const helperLabel = 'Local helper value';
