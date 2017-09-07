const scripts = require('../scripts');

module.exports = () => {
    const scriptNames = Object.keys(scripts).map(s => `${s}.sh`);

    return scriptNames.join(' ');
}