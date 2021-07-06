const readline = require('readline');
const config = require('../compiler/config/Config');
const parser = require('../parser/Parser');
const log = require("../functions/Log");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

log(config.welcome_message);

const ask = () => {
    rl.question(`RusPy (${config.version})> `, out => {
        parser(out);
        ask();
    });
}

ask();