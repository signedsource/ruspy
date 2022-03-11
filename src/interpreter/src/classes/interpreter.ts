import EventEmitter from "events";
import { blue } from "colorette";
import Lexer from "./lexer";

export default class Interpreter {
    file: string;
    output: EventEmitter;
    debug: any;

    constructor(file: string, debug?: boolean) {
        this.file = file;
        this.debug = debug;
        this.output = new EventEmitter();

        this.output.on("start", () => {
            if (debug) console.log(` ${blue("[DEBUG]")}  Starting ${this.file}`);
        });
    }

    run() {
        this.output.emit("start");
        new Lexer(this.file).parse();
    }

    getOutput() {
        this.run();
        return this.output;
    }
}