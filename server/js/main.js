// Module imports
const express = require('express');
const chalk = require('chalk');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Debug = require('debug');

// Classes
const { Response } = require('./classes/Response');

// Object inits
const debug = Debug('colwyn:main');
const app = express();

// Server variables
const port = 3001;
const env = process.env.NODE_ENV || 'development';

// App middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

app.post('/terminal-input', (req, res) => {
    const data = req.body;
    const input = data.input;
    const responseObject = new Response(input);
    const output = responseObject.response;
    res.json({ input, output });
});

// Server listen
app.listen(port, () => {
    debug(chalk.blue('colwyn.me') + ` started on port ${port} in ${env} mode`);
});
