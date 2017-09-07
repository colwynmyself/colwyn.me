const commands = require('../commands');
const scripts = require('../scripts');

class Response {
    constructor(input) {
        if (typeof input !== 'string') throw new Error(`Response class must be initialized with string input.\
            ${input} is an invalid type: ${typeof input}`);

        this._input = input.trim();
    }

    get input() { return this._input; }
    get response() { return this.responseLookup(this._input); }

    responseLookup(input) {
        if (!input) return;

        let response = `${input}: command not found`;
        if (input.match(/^\.\//)) {
            // Script
            const inputParsed = input.replace(/^(\.\/)/, '').replace(/\.sh$/, '');
            const script = scripts[inputParsed];
            if (script) response = script();
            else response = `${input}: No such file or directory`;
        } else {
            // Command
            const command = commands[input];
            if (command) response = command();
        }

        return response;
    }
}

module.exports = {
    Response,
};