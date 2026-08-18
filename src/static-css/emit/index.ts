// react-dom/server, @ant-design/cssinjs and antd-style pick their dev/prod flavor
// at import time and the dev flavor emits different CSS, so production must be
// forced before any React/antd module loads — hence this entry has no static
// imports of them and must be imported before anything that does.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { AntdStaticCssOptions, AntdStaticCssPayload } from '../buildAntdStaticCss';
import type { ThemeVarsCssOptions, ThemeVarsCssPayload } from '../themeVars';

process.env.NODE_ENV = 'production';

export interface EmitStaticCssOptions {
  antd?: AntdStaticCssOptions | false;
  manifestPath?: string;
  outDir: string;
  themeVars?: ThemeVarsCssOptions | false;
}

export interface EmitStaticCssResult {
  antd?: AntdStaticCssPayload;
  files: string[];
  themeVars?: ThemeVarsCssPayload;
}

export const emitStaticCssAssets = async (
  options: EmitStaticCssOptions,
): Promise<EmitStaticCssResult> => {
  const { outDir, manifestPath = path.join(outDir, 'static-css.manifest.json') } = options;

  await mkdir(outDir, { recursive: true });

  const result: EmitStaticCssResult = { files: [] };
  const manifest: Record<string, unknown> = {};

  if (options.antd !== false) {
    const { buildAntdStaticCss } = await import('../buildAntdStaticCss');
    const payload = buildAntdStaticCss(options.antd);
    const file = path.join(outDir, 'antd.css');
    await writeFile(file, payload.css, 'utf8');
    result.antd = payload;
    result.files.push(file);
    manifest.antd = { hash: payload.hash, href: payload.href, styleKeys: payload.styleKeys };
  }

  if (options.themeVars !== false) {
    const { buildThemeVarsCss } = await import('../themeVars');
    const payload = buildThemeVarsCss(options.themeVars);
    const file = path.join(outDir, 'theme-vars.css');
    await writeFile(file, payload.css, 'utf8');
    result.themeVars = payload;
    result.files.push(file);
    manifest.themeVars = { hash: payload.hash, href: payload.href };
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  result.files.push(manifestPath);

  return result;
};
