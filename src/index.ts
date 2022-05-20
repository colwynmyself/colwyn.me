import * as sass from 'sass';
import * as handlebars from 'handlebars';
import { minify } from 'html-minifier';
import { readFile, writeFile, readdir, lstat, access, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

async function readFileAsString(path: string) {
  return (await readFile(path)).toString('utf8');
}

interface TreeBranch {
  children: TreeBranch[];
  isDirectory: boolean;
  isRenderable: boolean;
  path: string;
}

async function fileTree(path: string, isRoot = false): Promise<TreeBranch> {
  const isDirectory = (await lstat(path)).isDirectory();
  const children = isDirectory ? await Promise.all((await readdir(path)).map(childPath => fileTree(join(path, childPath)))) : [];
  const isRenderable = !isRoot && !!children.find(child => child.path.endsWith('index.handlebars'));

  console.log(`${path} - Directory: ${isDirectory} - Renderable: ${isRenderable}.`);

  return {
    children,
    isDirectory,
    isRenderable,
    path,
  };
}

async function ensureDirectoryExists(path: string) {
  try {
    await access(path);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    await mkdir(path, { recursive: true });
  }
}

// This is a lotta jank, I'll clean it up later
async function renderComponent(bodyTemplate: handlebars.TemplateDelegate, path: string, outDir: string) {
  const outDirPath = path.replace(/^src\//, '');
  const cssPath = join(outDir, `${outDirPath}.css`);
  const htmlPath = join(outDir, `${outDirPath}.html`);
  const outputBasePath = dirname(cssPath);
  await ensureDirectoryExists(outputBasePath);

  const { css } = sass.compile(join(path, 'index.scss'));
  await writeFile(cssPath, css);

  const componentRaw = await readFileAsString(join(path, 'index.handlebars'));
  const componentTemplate = handlebars.compile(componentRaw, {
    noEscape: true,
  });
  const componentHtml = bodyTemplate({
    styles: `<link rel="stylesheet" href="${outDirPath}.css">`,
    content: componentTemplate({}),
  });

  const html = minify(componentHtml, {
    collapseWhitespace: true,
  });

  await writeFile(htmlPath, html);
}

async function main() {
  const outDir = './public';

  const { css } = sass.compile(join('./src', 'base.scss'));
  await ensureDirectoryExists(outDir);
  await writeFile(join(outDir, 'base.css'), css);

  const bodyHandlebars = await readFileAsString(join('./src', 'base.handlebars'));
  const bodyTemplate = handlebars.compile(bodyHandlebars, {
    noEscape: true,
  });

  const tree = await fileTree('src/', true);
  console.log(tree);
  let treeStack: TreeBranch[] = [tree];

  while (treeStack.length) {
    console.log(`Stack length: ${treeStack.length}`);

    const branch = treeStack.pop();
    if (!branch) {
      break;
    }

    console.log(`Processing ${branch.path} - Renderable: ${branch.isRenderable}`);

    treeStack = treeStack.concat(branch.children);

    if (branch.isRenderable) {
      await renderComponent(bodyTemplate, branch.path, outDir);
    }
  }
}

(async () => {
  try {
    await main();
    console.log(`Completed building at ${new Date().toISOString()}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(`Error building project: ${e.message}`);
  }
})();
