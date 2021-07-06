const IntType = require("../types/IntType");
const MathTypes = require("../types/MathTypes");
const StringType = require("../types/StringType");
const UnknownType = require("../types/UnknownType");
const intParser = require("./IntParser");
const mathParser = require("./MathParser");
const stringParser = require("./StringParser");

const tokenParser = e => {
    if (stringParser(e)) {
        return StringType(e);
    } else if (intParser(e)) {
        return IntType(e);
    } else if (mathParser(e)) {
        return MathTypes(e);
    } else {
        return UnknownType(e);
    }
}

module.exports = tokenParser;