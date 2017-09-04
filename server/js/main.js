// Module imports
import 'babel-polyfill';
import koa from 'koa';
import route from 'koa-route';
import chalk from 'chalk';
import path from 'path';

// Module constructor imports
import Debug from 'debug';
import Logger from 'koa-logger';
import Cache from 'koa-static-cache';
import KoaBody from 'koa-body';
import Handlebars from 'koa-handlebars';

// Classes
import { Response } from './classes/Response';

// Generic variables
const basedir = path.resolve(__dirname, '..', '..');
const publicdir = path.resolve(basedir, 'public');
const serverdir = path.resolve(basedir, 'server');
const nodeModules = path.resolve(basedir, 'node_modules');

// Object inits
const debug = Debug('colwyn:main');
const app = koa();
const logger = Logger();

// Server variables
const port = 3001;
const env = process.env.NODE_ENV || 'development';
const cacheObject = {
    maxAge: env !== 'development' ? (24 * 60 * 60) : 0,
    gzip: true,
};

// App middleware
app.use(Handlebars(handlebarsObject));
app.use(logger);
app.use(KoaBody());

// Routes
app.use(route.get('/', function* index() {
    yield this.render('index');
}));

app.use(route.post('/terminal-input', function* terminalnput() {
    const data = this.request.body;
    const input = data.input;
    const responseObject = new Response(input);
    const output = responseObject.response;
    this.body = { input, output };
}));

// Server listen
app.listen(port, () => {
    debug(chalk.blue('colwyn.me') + ` started on port ${port} in ${env} mode`);
});
