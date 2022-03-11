import Interpreter from "./src/interpreter/src/classes/interpreter";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { red, bgRed, white } from "colorette";

const argv = yargs(hideBin(process.argv)).argv;

// @ts-ignore
if (argv.file !== null) {
    // @ts-ignore
    if (argv.compile) {

    } else {
        // @ts-ignore
        let out = new Interpreter(argv.file).getOutput();
        out.on("output", (str: string) => {
            console.log(str);
        });

        out.on("error", (str: string, crashed: boolean) => {
            console.log(`  ${bgRed(white("[ERROR]"))}  ${red(str)}`);
            if (crashed) process.exit(-1);
        });
    }
} else {
    console.log(red("You must provide a file to interpret / compile"));
}
