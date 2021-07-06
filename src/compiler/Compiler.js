const mathModule = require("./modules/MathModule");

const compiler = async arr => {
    if (mathModule(arr)) {
        return "";
    }
}

module.exports = compiler;