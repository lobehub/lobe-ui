import { extractStaticStyle } from 'antd-style';
import chalk from 'chalk';
import type { IApi } from 'dumi';
import fs from 'node:fs';
import { join } from 'node:path';

import { getHash } from './utils';

/*
 * SSR 抽取样式
 */
const SSRPlugin = (api: IApi) => {
  api.describe({
    key: '@',
  });

  // 如果没有开启 SSR，则啥也不做
  if (!api.userConfig.ssr) return;

  api.logger.info('detect ssr config, when building html will extract css.');

  const writeCSSFile = (key: string, hashKey: string, cssString: string) => {
    const fileName = `ssr-${key}.${getHash(hashKey)}.css`;

    const filePath = join(api.paths.absOutputPath, fileName);

    if (!fs.existsSync(filePath)) {
      api.logger.event(chalk.grey(`write to: ${filePath}`));
      fs.writeFileSync(filePath, cssString, 'utf8');
    }

    return fileName;
  };

  const addLinkStyle = (html: string, cssFile: string) => {
    const prefix = api.userConfig.publicPath || api.config.publicPath;

    return html.replace('</head>', `<link rel="stylesheet" href="${prefix + cssFile}"></head>`);
  };

  api.modifyExportHTMLFiles((files) =>
    files
      // exclude dynamic route path, to avoid deploy failed by `:id` directory
      .filter((f) => !f.path.includes(':'))

      .map((file) => {
        const antdCache = (global as any).__ANTD_CACHE__;

        // 提取 antd-style 样式到独立 css 文件
        const styles = extractStaticStyle(file.content, { antdCache });

        for (const result of styles) {
          api.logger.event(
            `${chalk.yellow(file.path)} include ${chalk.blue`[${result.key}]`} ${chalk.yellow(
              result.ids.length,
            )} styles`,
          );

          const cssFile = writeCSSFile(result.key, result.ids.join(''), result.css);

          file.content = addLinkStyle(file.content, cssFile);
        }

        return file;
      }),
  );
};

export default SSRPlugin;
