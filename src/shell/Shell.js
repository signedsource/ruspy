const readline = require('readline');
const { version, welcome_message } = require('../compiler/config/Config');
const parser = require('../parser/Parser');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(welcome_message);

const ask = () => {
    rl.question(`RusPy (${version})> `, out => {
        parser(out);
        ask();
    });
}

ask();