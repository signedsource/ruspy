const mathModule = async e => {
    var num = 0;

    for (let i = 0; i < e.length; i++) {
        let plusindex = e.indexOf("+");

        let f1 = e[plusindex - 1];
        let f2 = e[plusindex + 1];
        let f3 = e[plusindex + 2];

        num = num + Number(f1);
        num = num + Number(f2);

        e.splice(plusindex, 1);
        e.splice(e.indexOf(f1), 1);
        e.splice(e.indexOf(f2), 1);
        e.splice(e.indexOf(f3), 1);

        i++;
    }


    console.log(num);
    return true;
}

module.exports = mathModule;