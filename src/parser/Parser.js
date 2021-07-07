const tokenParser = require("./tokens/TokenParser");
const log = require("../functions/Log");

const parser = async out => {
    out = out.match(/\S+|"[^"]+"/g)

    out.forEach(async e => {
        log(await tokenParser(e));
    });
}

module.exports = parser;