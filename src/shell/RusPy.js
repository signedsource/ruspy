const readlineSync = require('readline-sync');
const config = require('../compiler/config/Config');
const parser = require('../parser/Parser');
const log = require("../functions/Log");
const compiler = require('../compiler/Compiler');
const fs = require("fs");

log(config.welcome_message);
log("idk")

const ask = async () => {
	let out;
	out = null;
	out = readlineSync.question(`RusPy (${config.version})> `);

	await parser(out);
	ask();
}


if (!process.argv[2]) {
	ask();
} else if (process.argv[2]) {
	compiler(fs.readFileSync(process.argv[2]).toString().split("\n"))
}
