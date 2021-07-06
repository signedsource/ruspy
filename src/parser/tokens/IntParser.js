const intParser = e => {
    if (!isNaN(e) || !isNaN(parseFloat(e))) {
        return true;
    } else {
        return false;
    }
}

module.exports = intParser;