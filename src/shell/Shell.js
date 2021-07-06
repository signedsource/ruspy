const readline = require('readline');
const version = require('../compiler/config/Config');
const parser = require('../parser/Parser');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = () => {
    rl.question(`RusPy (${version})> `, out => {
        parser(out);
        ask();
    });
}

ask();