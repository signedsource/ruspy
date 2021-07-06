const log = require("../../functions/Log");

const shellCommandsParser = e => {
    switch (e) {
        case ".exit":
            process.exit();
            return true;
            break;
        case ".clear":
            console.clear();
            return true;
            break;
        case ".help":
            log(".exit to exit the terminal")
            log(".clear to clear the terminal")
            log(".help to display this message")
            return true;
            break;
        default:
            return false;
            break;
    }
}

module.exports = shellCommandsParser;