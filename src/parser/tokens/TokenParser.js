const FalseType = require("../types/FalseType");
const IntType = require("../types/IntType");
const MathTypes = require("../types/MathTypes");
const StringType = require("../types/StringType");
const TrueType = require("../types/TrueType");
const UnknownType = require("../types/UnknownType");
const trueParser = require("./TrueParser");
const falseParser = require("./FalseParser");
const intParser = require("./IntParser");
const mathParser = require("./MathParser");
const shellCommandsParser = require("./ShellCommandsParser");
const stringParser = require("./StringParser");

const tokenParser = async e => {
    if (stringParser(e)) {
        return StringType(e);
    } else if (intParser(e)) {
        return IntType(e);
    } else if (mathParser(e)) {
        return MathTypes(e);
    } else if (shellCommandsParser(e)) {
        return "\r";
    } else if (trueParser(e)) {
        return TrueType(e);
    } else if (falseParser(e)) {
        return FalseType(e);
    } else {
        return UnknownType(e);
    }
}

module.exports = tokenParser;