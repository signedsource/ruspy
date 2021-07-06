const falseParser = e => {
    if (e == "False") {
        return true;
    } else {
        return false;
    }
}

module.exports = falseParser;