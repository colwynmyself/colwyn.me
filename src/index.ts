import * as sass from 'sass';
import * as handlebars from 'handlebars';
import { minify } from 'html-minifier';
import { readFile, writeFile, readdir, lstat, access, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

enum logLevels {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARNING = 3,
  ERROR = 4,
  CRITICAL = 5,
}

class Logger {
  private logLevel: number;

  constructor(logLevel: string = process.env.LOG_LEVEL || 'INFO') {
    if (!Object.keys(logLevels).includes(logLevel)) {
      throw new Error(`Log level ${logLevel} is invalid. Must be one of: ${Object.keys(logLevels).join(', ')}`);
    }

    // Magic type coersion https://stackoverflow.com/a/41970976
    this.logLevel = logLevels[logLevel as keyof typeof logLevels];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log(level: number, message: string, extras: any[]) {
    if (this.logLevel <= level) {
      if (extras.length) {
        console.log(message, ...extras);
      } else {
        console.log(message);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public trace(message: string, ...extras: any[]) {
    this.log(logLevels.TRACE, message, extras);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debug(message: string, ...extras: any[]) {
    this.log(logLevels.DEBUG, message, extras);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public info(message: string, ...extras: any[]) {
    this.log(logLevels.INFO, message, extras);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public warning(message: string, ...extras: any[]) {
    this.log(logLevels.WARNING, message, extras);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(message: string, ...extras: any[]) {
    this.log(logLevels.ERROR, message, extras);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public critical(message: string, ...extras: any[]) {
    this.log(logLevels.CRITICAL, message, extras);
  }
}

const logger = new Logger();

async function readFileAsString(path: string) {
  return (await readFile(path)).toString('utf8');
}

interface TreeBranch {
  children: TreeBranch[];
  isDirectory: boolean;
  isRenderable: boolean;
  path: string;
}

interface NavItem {
  path: string;
  name: string;
}

async function fileTree(path: string, isRoot = false): Promise<TreeBranch> {
  const isDirectory = (await lstat(path)).isDirectory();
  const children = isDirectory ? await Promise.all((await readdir(path)).map(childPath => fileTree(join(path, childPath)))) : [];
  const isRenderable = !isRoot && !!children.find(child => child.path.endsWith('index.handlebars'));

  logger.debug(`${path} - Directory: ${isDirectory} - Renderable: ${isRenderable}.`);

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

function generateNavigation(tree: TreeBranch) {
  return tree.children.reduce((acc: NavItem[], child) => {
    if (child.isRenderable) {
      const path = child.path.replace(/src\//, '');
      if (path === 'index') {
        acc.push({
          path: '/',
          name: 'Home',
        });
      } else {
        const pathParts = path.split('/');
        const lowercaseName = pathParts[pathParts.length - 1];
        acc.push({
          path,
          name: lowercaseName.charAt(0).toUpperCase() + lowercaseName.slice(1),
        });
      }
    }

    return acc;
  }, []);
}

// This is a lotta jank, I'll clean it up later
async function renderComponent(bodyTemplate: handlebars.TemplateDelegate, navigationItems: NavItem[], path: string, outDir: string) {
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
    navigationItems,
    styles: `<link rel="stylesheet" href="/${outDirPath}.css">`,
    content: componentTemplate({}),
  });

  const html = minify(componentHtml, {
    collapseWhitespace: true,
  });

  await writeFile(htmlPath, html);
}

async function main() {
  const outDir = './public';
  await ensureDirectoryExists(outDir);

  const { css } = sass.compile(join('./src', 'base.scss'));
  await writeFile(join(outDir, 'base.css'), css);

  const tree = await fileTree('src/', true);

  const bodyHandlebars = await readFileAsString(join('./src', 'base.handlebars'));
  const bodyTemplate = handlebars.compile(bodyHandlebars, {
    noEscape: true,
  });
  const navigationItems = generateNavigation(tree);

  let treeStack: TreeBranch[] = [tree];
  while (treeStack.length) {
    logger.trace(`Stack length: ${treeStack.length}`);

    const branch = treeStack.pop();
    if (!branch) {
      break;
    }

    logger.info(`Processing ${branch.path} - Renderable: ${branch.isRenderable}`);

    treeStack = treeStack.concat(branch.children);

    if (branch.isRenderable) {
      await renderComponent(bodyTemplate, navigationItems, branch.path, outDir);
    }
  }
}

(async () => {
  try {
    await main();
    logger.info(`Completed building at ${new Date().toISOString()}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    logger.critical(`Error building project: ${e.message}`);
  }
})();
