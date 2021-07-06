const stringParser = e => {
    if (e[0] == '"' && e[e.length - 1] == '"') {
        return true;
    } else {
        return false;
    }
}

module.exports = stringParser;
