import * as sass from 'sass';
import * as handlebars from 'handlebars';
import { minify } from 'html-minifier';
import { copyFile, readFile, writeFile, readdir, lstat, access, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import * as octicons from '@primer/octicons';

const config = {
  googleSiteVerification: 'AKy47xnP5wi_lNDJgGZ6yLGoyXGOB1Di8hTq81aPJGw',
};

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
  isNavigable: boolean;
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

  const pathParts = path.split('/');
  const filename = pathParts[pathParts.length - 1];
  const isError = filename.startsWith('e_');
  const isNavigable = isRenderable && !isError;

  logger.debug(`${path} - Directory: ${isDirectory} - Renderable: ${isRenderable}.`);

  return {
    children,
    isDirectory,
    isRenderable,
    isNavigable,
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

// More jank, this doesn't go more than one level deep right now, also it's pretty tightly coupled to our folder
// structure. Such is life.
function generateNavigation(tree: TreeBranch) {
  return tree.children.reduce((acc: NavItem[], child) => {
    if (child.isNavigable) {
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
async function renderComponent(path: string, outDir: string) {
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

  return {
    componentTemplate,
    htmlPath,
    outDirPath,
  };
}

async function main() {
  // Setup helpers
  handlebars.registerHelper('icon', function (name: octicons.IconName, size: number) {
    // Available icons can be found here: https://primer.github.io/octicons/
    logger.debug(`Rendering icon ${name}`);

    if (!octicons[name]) {
      logger.warning(`Icon ${name} does not exist! Returning nothing.`);
      return '';
    }

    return octicons[name].toSVG({
      width: size,
      height: size,
    });
  });

  const outDir = './public';
  await ensureDirectoryExists(outDir);

  // Static files
  await copyFile('./src/robots.txt', './public/robots.txt');
  await copyFile('./src/favicon.ico', './public/favicon.ico');
  await copyFile('./node_modules/@primer/octicons/build/build.css', './public/octicons.css');

  // Compile base framework
  const { css } = sass.compile(join('./src', 'base.scss'));
  await writeFile(join(outDir, 'base.css'), css);

  const bodyHandlebars = await readFileAsString(join('./src', 'base.handlebars'));
  const bodyTemplate = handlebars.compile(bodyHandlebars, {
    noEscape: true,
  });

  // Build page tree
  const tree = await fileTree('src/', true);
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
      const { componentTemplate, outDirPath, htmlPath } = await renderComponent(branch.path, outDir);

      const componentHtml = bodyTemplate({
        navigationItems,
        styles: `<link rel="stylesheet" href="/${outDirPath}.css">`,
        content: componentTemplate({}),
        googleSiteVerification: config.googleSiteVerification,
      });

      const html = minify(componentHtml, {
        collapseWhitespace: true,
      });

      await writeFile(htmlPath, html);
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
