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
        default:
            return false;
            break;
    }
}

module.exports = shellCommandsParser;