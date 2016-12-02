import { responseHash } from '../data.js';

class Response {
    constructor(input) {
        this._input = input;
    }

    get input() { return this._input; }
    get response() { return this.responseLookup(this._input); }

    responseLookup(input) {
        return responseHash[input] || `${input}: command not found`;
    }
}

module.exports = {
    Response,
};