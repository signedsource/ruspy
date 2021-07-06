const IntType = require("../types/IntType");
const StringType = require("../types/StringType");
const UnknownType = require("../types/UnknownType");
const intParser = require("./IntParser");
const stringParser = require("./StringParser");

const tokenParser = e => {
    if (stringParser(e)) {
        return StringType(e);
    } else if (intParser(e)) {
        return IntType(e);
    } else {
        return UnknownType(e);
    }
}

module.exports = tokenParser;