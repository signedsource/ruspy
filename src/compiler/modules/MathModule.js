const mathModule = async e => {
    let plusindex = e.indexOf("+");

    let f1 = Number(e[plusindex - 1]);
    let f2 = Number(e[plusindex + 1]);

    console.log(f1 + f2);
    return true;
}

module.exports = mathModule;