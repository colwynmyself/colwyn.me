import * as sass from 'sass';
import * as handlebars from 'handlebars';
import { minify } from 'html-minifier';
import { readFile, writeFile, readdir } from 'fs/promises';

async function readFileAsString(path: string) {
  return (await readFile(path)).toString('utf8');
}

// This is a lotta jank, I'll clean it up later
async function renderComponent(bodyTemplate: handlebars.TemplateDelegate, path: string, page: string, outDir: string) {
  const { css } = sass.compile(`${path}/index.scss`);
  await writeFile(`${outDir}/${page}.css`, css);

  const componentRaw = await readFileAsString(`${path}/index.handlebars`);
  const componentTemplate = handlebars.compile(componentRaw, {
    noEscape: true,
  });
  const componentHtml = bodyTemplate({
    styles: `<link rel="stylesheet" href="${page}.css">`,
    content: componentTemplate({}),
  });

  const html = minify(componentHtml, {
    collapseWhitespace: true,
  });

  await writeFile(`${outDir}/${page}.html`, html);
}

async function main() {
  const outDir = './public';

  const { css } = sass.compile('./src/index.scss');
  await writeFile(`${outDir}/index.css`, css);

  const bodyHandlebars = await readFileAsString('./src/index.handlebars');
  const bodyTemplate = handlebars.compile(bodyHandlebars, {
    noEscape: true,
  });

  for (const page of await readdir('./src/pages')) {
    await renderComponent(bodyTemplate, `./src/pages/${page}`, page, outDir);
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
