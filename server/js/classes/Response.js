import { responseHash } from '../data.js';

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
        return responseHash[input] || `${input}: command not found`;
    }
}

module.exports = {
    Response,
};