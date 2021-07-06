const compiler = require("../compiler/Compiler");
const tokenParser = require("./tokens/TokenParser");
const fs = require("fs");

const parser = async out => {
    out = out.split("'")

    var strObj = {};

    out.forEach(char => {
        if (char.startsWith('"') && char.endsWith('"')) {
            strObj[out.indexOf(char)] = char;
            out.splice(out.indexOf(char), 1);
        }
    });

    out = out.join(" ");
    out = out.split(" ");

    Object.keys(strObj).forEach(key => {
        out.splice(key, 0, strObj[key]);
    });

    out.forEach((char, i) => {
        if (out.indexOf(out[i]) !== 0 || out.indexOf(out[i]) !== out.length) {
            if (out[i].startsWith(" ") || out[i].endsWith(" ")) {
                out[i] = out[i].slice(1, -1)
            }
        }
    });

    out = out.filter(el => {
        return el != "" || null;
    });

    if (process.argv[2] == "--typeparser") {
        out.forEach(async char => {
            await console.log(tokenParser(char));
        });
    } else if (process.argv[2] == "--compiler") {
        compiler(out);
    } else {
        compiler(fs.readFileSync(process.argv[2]).toString().split("\n"));
    }
}

module.exports = parser;
