import * as cheerio from 'cheerio';
import { config } from 'dotenv';
import * as _ from 'es-toolkit/compat';
import { Client } from 'figma-js';
import type { Canvas, ClientInterface, Document } from 'figma-js';
import { mkdir, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import * as prettier from 'prettier';
import * as svgo from 'svgo';

// Load environment variables from .env and .env.local
config();
config({ override: true, path: '.env.local' });

interface Icon {
  displayName: string;
  fileName: string;
  id: string;
  name: string;
}

function createFigmaClient(): ClientInterface {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    throw new Error('FIGMA_ACCESS_TOKEN environment variable is required');
  }
  return Client({ personalAccessToken: token });
}

async function getFigmaDocument(client: ClientInterface, fileKey: string): Promise<Document> {
  const response = await client.file(fileKey);
  return response.data.document;
}

function getExtraPage(document: Document): Canvas | null {
  const canvas = document.children.find((page) => page.name.toLowerCase() === 'extra');
  return canvas && canvas.type === 'CANVAS' ? (canvas as Canvas) : null;
}

function getIcons(extraCanvas: Canvas): Icon[] {
  const icons: Icon[] = [];

  // Each child should be a frame/component representing an icon
  extraCanvas.children?.forEach((node) => {
    if (node.type === 'COMPONENT' || node.type === 'FRAME') {
      // Convert name like "Globe Off" to "GlobeOffIcon"
      const displayName = _.upperFirst(
        // @ts-ignore
        _.camelCase(node.name.replaceAll(/([\da-z])([\dA-Z])/g, '$1 $2')),
      );
      const fileName = `${displayName}Icon`;

      icons.push({
        displayName,
        fileName,
        id: node.id,
        name: node.name,
      });
    }
  });

  return icons;
}

async function renderIconsToSvgs(
  client: ClientInterface,
  fileKey: string,
  iconIds: string[],
): Promise<Record<string, string>> {
  const response = await client.fileImages(fileKey, {
    format: 'svg',
    ids: iconIds,
  });

  const images = response.data.images;

  if (!images || Object.keys(images).length === 0) {
    throw new Error('No images returned from Figma');
  }

  return images;
}

async function downloadSvg(url: string): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to download SVG: ${resp.status}`);
  }
  return resp.text();
}

async function passSVGO(svgRaw: string): Promise<string> {
  const { data } = svgo.optimize(svgRaw, {
    plugins: [
      'removeDoctype',
      'removeXMLProcInst',
      'removeComments',
      'removeMetadata',
      // "removeXMLNS",
      'removeEditorsNSData',
      'cleanupAttrs',
      'minifyStyles',
      'convertStyleToAttrs',
      'cleanupIds',
      'removeRasterImages',
      'removeUselessDefs',
      'cleanupNumericValues',
      // "cleanupListOfValues",
      'convertColors',
      'removeUnknownsAndDefaults',
      'removeNonInheritableGroupAttrs',
      'removeUselessStrokeAndFill',
      // "removeViewBox",
      'cleanupEnableBackground',
      'removeHiddenElems',
      'removeEmptyText',
      'convertShapeToPath',
      'moveElemsAttrsToGroup',
      'moveGroupAttrsToElems',
      'collapseGroups',
      // "convertPathData",
      'convertTransform',
      'removeEmptyAttrs',
      'removeEmptyContainers',
      'mergePaths',
      'removeUnusedNS',
      // "sortAttrs",
      'removeTitle',
      'removeDesc',
      // "removeDimensions",
      // "removeStyleElement",
      // "removeScripts",
    ],
  });
  return data;
}

function extractPathsFromSvg(svgContent: string): Array<[string, Record<string, string>]> {
  const $ = cheerio.load(svgContent, { xmlMode: true });
  const paths: Array<[string, Record<string, string>]> = [];

  let keyIndex = 1;

  // Extract all path elements
  $('path, circle, rect, line, polyline, polygon, ellipse').each((_i, el) => {
    const tagName = el.name;
    const attrs: Record<string, string> = {};

    // Skip rect elements that are 24x24 (these are artboard boundaries from Figma)
    if (tagName === 'rect') {
      const width = $(el).attr('width');
      const height = $(el).attr('height');
      if (width === '24' && height === '24') {
        return; // Skip this element
      }
    }

    // Skip path elements that are 24x24 artboard boundaries (converted by SVGO)
    if (tagName === 'path') {
      const d = $(el).attr('d');
      // This is the 24x24 rect converted to path by SVGO
      if (d === 'M0 0H24V24H0z' || d === 'M0 0h24v24H0z') {
        return; // Skip this element
      }
    }

    // Get all attributes, excluding stroke-related and fill/stroke attributes
    const excludedAttrs = new Set([
      'fill',
      'stroke',
      'xmlns',
      'stroke-width',
      'strokeWidth',
      'stroke-linecap',
      'strokeLinecap',
      'stroke-linejoin',
      'strokeLinejoin',
      'stroke-miterlimit',
      'strokeMiterlimit',
    ]);

    Object.keys(el.attribs).forEach((attrKey) => {
      const value = $(el).attr(attrKey);
      const camelKey = _.camelCase(attrKey);

      if (value && !excludedAttrs.has(attrKey) && !excludedAttrs.has(camelKey)) {
        attrs[camelKey] = value;
      }
    });

    // Add key attribute at the end
    attrs.key = String(keyIndex++);

    paths.push([tagName, attrs]);
  });

  return paths;
}

function generateIconComponent(icon: Icon, paths: Array<[string, Record<string, string>]>): string {
  const pathsStr = paths
    .map(([tagName, attrs]) => {
      const attrsStr = Object.entries(attrs)
        .map(([key, value]) => {
          return `      ${key}: '${value}',`;
        })
        .join('\n');

      return `  [\n    '${tagName}',\n    {\n${attrsStr}\n    },\n  ]`;
    })
    .join(',\n');

  return `import { createLucideIcon } from 'lucide-react';

const ${icon.fileName} = createLucideIcon('${icon.name}', [
${pathsStr},
]);

${icon.fileName}.displayName = '${icon.fileName}';

export default ${icon.fileName};
`;
}

async function generateIndexFile(icons: Icon[]): Promise<string> {
  const exports = icons
    .map((icon) => `export { default as ${icon.fileName} } from './${icon.fileName}';`)
    .join('\n');

  return exports + '\n';
}

async function main() {
  console.log('🚀 Starting Figma to Lucide Extra conversion...\n');

  // Extract file key from URL or use directly
  const fileKey = 'aHzK4vQNj8KpuK7nMOWDp3';

  console.log('📋 Fetching Figma document...');
  const figmaClient = createFigmaClient();
  const document = await getFigmaDocument(figmaClient, fileKey);

  console.log('🔍 Finding "extra" page...');
  const extraPage = getExtraPage(document);

  if (!extraPage) {
    throw new Error('Could not find "extra" page in Figma file');
  }

  console.log('🎨 Extracting icons...');
  const icons = getIcons(extraPage);
  console.log(`   Found ${icons.length} icons`);

  if (icons.length === 0) {
    throw new Error('No icons found on "extra" page');
  }

  console.log('\n📐 Rendering icons to SVG...');
  const iconIds = icons.map((icon) => icon.id);
  const svgUrls = await renderIconsToSvgs(figmaClient, fileKey, iconIds);

  console.log('⬇️  Downloading and processing SVGs...');
  const outputDir = path.resolve(process.cwd(), 'src/icons/lucideExtra');

  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  let processedCount = 0;

  for (const icon of icons) {
    const svgUrl = svgUrls[icon.id];
    if (!svgUrl) {
      console.warn(`   ⚠️  No SVG URL for ${icon.name}`);
      continue;
    }

    // Download SVG
    let svgContent = await downloadSvg(svgUrl);

    // Optimize SVG with SVGO
    svgContent = await passSVGO(svgContent);

    // Extract paths
    const paths = extractPathsFromSvg(svgContent);

    // Generate component
    const componentCode = generateIconComponent(icon, paths);

    // Format with prettier
    const prettierOptions = await prettier.resolveConfig(process.cwd());
    const formattedCode = await prettier.format(componentCode, {
      ...prettierOptions,
      parser: 'typescript',
    });

    // Write file
    const filePath = path.join(outputDir, `${icon.fileName}.tsx`);
    await writeFile(filePath, formattedCode, 'utf8');

    processedCount++;
    console.log(`   ✅ ${icon.fileName}.tsx`);
  }

  console.log('\n📦 Generating index.ts...');
  const indexContent = await generateIndexFile(icons);
  const prettierOptions = await prettier.resolveConfig(process.cwd());
  const formattedIndex = await prettier.format(indexContent, {
    ...prettierOptions,
    parser: 'typescript',
  });

  const indexPath = path.join(outputDir, 'index.ts');
  await writeFile(indexPath, formattedIndex, 'utf8');

  console.log(`\n✨ Successfully generated ${processedCount} icon components!`);
  console.log(`📁 Output directory: ${outputDir}`);
}

try {
  await main();
} catch (error: any) {
  console.error('\n❌ Error:', error.message);
  throw error;
}
