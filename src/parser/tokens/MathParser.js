const mathParser = e => {
    switch (e) {
        case "+":
            return true;
            break;
        case "-":
            return true;
            break;
        case "*":
            return true;
            break;
        case "/":
            return true;
            break;
        default:
            return false;
            break;
    }
}

module.exports = mathParser;