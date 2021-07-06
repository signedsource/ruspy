const MathTypes = e => {
    switch (e) {
        case "+":
            return `ADD:${e}`;
            break;
        case "-":
            return `SUB:${e}`;
            break;
        case "*":
            return `MUL:${e}`;
            break;
        case "/":
            return `DIV:${e}`;
            break;
    }
}

module.exports = MathTypes;