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

// Generic variables
const basedir = path.join(__dirname, '..');
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

// Routes
app.use(route.get('/', function* home() {
    yield this.render('home');
}));

// Server listen
app.listen(port, () => {
    debug(chalk.blue('colwyn.me') + ` started on port ${port} in ${env} mode`);
});