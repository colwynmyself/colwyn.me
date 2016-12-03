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
import Handlebars from 'koa-handlebars';
import KoaBody from 'koa-body';

// Classes
import { Response } from './classes/Response';

// Generic variables
const basedir = path.join(__dirname, '..', '..');
const serverdir = path.join(basedir, 'server');
const fedir = path.join(basedir, 'frontend');

// Object inits
const debug = Debug('colwyn:main');
const app = koa();
const logger = Logger();

// Server variables
const port = 3000;
const env = process.env.NODE_ENV || 'development';
const handlebarsObject = {
    root: '/',
    cache: env !== 'development',
    defaultLayout: 'main',
    layoutsDir: path.join(serverdir, 'hbs', 'layouts'),
    partialsDir: path.join(serverdir, 'hbs', 'partials'),
    viewsDir: path.join(serverdir, 'hbs', 'views'),
};
const cacheObject = {
    maxAge: env !== 'development' ? (24 * 60 * 60) : 0,
};

// App middleware
app.use(logger);
app.use(Handlebars(handlebarsObject));
app.use(Cache(path.join(fedir, 'public'), cacheObject));
app.use(KoaBody());

// Routes
app.use(route.get('/', function* home() {
    yield this.render('home');
}));

app.use(route.get('/resume', function* resume() {
    yield this.render('resume');
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