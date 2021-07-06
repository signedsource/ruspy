const tokenParser = require("./tokens/TokenParser");

const parser = async out => {
    out = out.split("'")

    out = out.join(" ");
    out = out.split(" ");

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

    out.forEach(async char => {
        await console.log(tokenParser(char));
    });
}

module.exports = parser;
