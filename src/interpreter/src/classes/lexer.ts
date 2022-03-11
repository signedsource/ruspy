import { readFileSync } from "fs";
import { Tokens } from "../enums/tokens";
import { Types } from "../enums/types";
import ASTHelper from "../helpers/ASTHelper";
import AbstractSyntaxTree from "../objects/ast";

export default class Lexer {
    file: string;
    parsed: Array<{ token: Tokens | string, start: number, end: number }>;
    unparsed: string[];
    ast: ASTHelper;
    opts: { [key: string]: any };
    stringBuffer: { string: string, start: number, end: number };
    macroBuffer: { string: string, start: number, end: number };

    constructor(file: string) {
        this.file = file;
        this.parsed = [];
        this.unparsed = [];

        this.stringBuffer = {
            string: "",
            start: 0,
            end: 0
        };

        this.macroBuffer = {
            string: "",
            start: 0,
            end: 0
        }

        this.opts = {
            insideOfString: {
                active: false,
                children: { start: 0, end: 0}
            },
            insideOfParenthesis: {
                active: false,
                children: Array<{ start: number, end: number }>()
            },
            insideOfBrackets: {
                active: false,
                children: Array<{ start: number, end: number }>()
            },
            insideOfMacro: {
                active: false,
                children: { start: 0, end: 0 }
            }
        };

        this.ast = new ASTHelper();
    }

    private generateAST(parsedTokens: Array<{ token: Tokens | string, start: number, end: number }>): AbstractSyntaxTree {
        parsedTokens.forEach(component => {
            if (component.token === Tokens.T_MAIN) {
                this.ast.setMainMacro(component.token, Types.TP_MACRO, component.start, component.end);
            } else if (component.token === Tokens.T_COMPILE) {
                this.ast.setCompileMacro(component.token, Types.TP_MACRO, component.start, component.end);
            } else if (component.token === Tokens.T_PRINT) {
                this.ast.addDeclaration(component.token, Types.TP_FUNCTION, component.start, component.end);
            } else {
                this.ast.addDeclaration(component.token, Types.TP_LEXICON, component.start, component.end);
            }
        });

        return this.ast.getInstance();
    }

    private registerOpt(name: string, start: number, end: number) {
        if (!(typeof this.opts[name].children.length === "undefined")) {
            this.opts[name].active = true;
            this.opts[name].children.push({ start, end });
        } else {
            this.opts[name].active = true;
            this.opts[name].children = { start, end };
        }
    }

    private removeOpt(name: string) {
        if (this.opts[name].children.length > 0) {
            this.opts[name].children.shift();

            if (!(this.opts[name].children.length > 0)) this.opts[name].active = false;
        } else {
            this.opts[name].active = false;
        }
    }

    private getActiveOpt(name: string) {
        return this.opts[name].active;
    }

    parse() {
        readFileSync(this.file).toString().split("").forEach((char, index) => {
            console.log(`Current char: ${char}\nCurrent unparsed: ${this.unparsed.join("")}\nCurrent parsed: ${this.parsed.map(component => component.token).join("")}\nCurrent opts: ${JSON.stringify(this.opts)}`);

            if (char === "\t" || char === "\n" || char === "\r") {
                return;
            } else if (char === "$") {
                if (this.getActiveOpt("insideOfString")) {
                    this.stringBuffer.string += char;
                    this.stringBuffer.end = index;
                } else {
                    this.parsed.push({ token: Tokens.T_DOLAR, start: index + 1, end: index + 2 });
                    this.registerOpt("insideOfMacro", index + 1, index + 2);
                }
            } else if (char === "[") {
                if (this.getActiveOpt("insideOfString")) {
                    this.stringBuffer.string += char;
                    this.stringBuffer.end = index;
                } else {
                    this.parsed.push({ token: Tokens.T_RBRACKET, start: index + 1, end: index + 2 });
                    this.registerOpt("insideOfBrackets", index + 1, index + 2);
                }
            } else if (char === "]") {
                if (this.getActiveOpt("insideOfString")) {
                    this.stringBuffer.string += char;
                    this.stringBuffer.end = index;
                } else {
                    this.parsed.push({ token: Tokens.T_LBRACKET, start: index + 1, end: index + 2 });
                    this.removeOpt("insideOfBrackets");
                }
            } else if (char === "(") {
                if (this.getActiveOpt("insideOfString")) {
                    this.stringBuffer.string += char;
                    this.stringBuffer.end = index;
                } else {
                    this.parsed.push({ token: Tokens.T_RPAREN, start: index + 1, end: index + 2 });
                    this.registerOpt("insideOfParenthesis", index + 1, index + 2);
                }
            } else if (char === ")") {
                if (this.getActiveOpt("insideOfString")) {
                    this.stringBuffer.string += char;
                    this.stringBuffer.end = index;
                } else {
                    this.parsed.push({ token: Tokens.T_LPAREN, start: index + 1, end: index + 2 });
                    this.removeOpt("insideOfParenthesis");
                }
            } else if (char === '"') {
                if (this.getActiveOpt("insideOfString")) {
                    this.removeOpt("insideOfString");
                    this.parsed.push({ token: this.stringBuffer.string, start: this.stringBuffer.start, end: index });
                    
                    this.stringBuffer = {
                        string: "",
                        start: 0,
                        end: 0
                    };
                } else {
                    this.registerOpt("insideOfString", index + 1, index + 2);
                }

                this.parsed.push({ token: Tokens.T_QUOTATION_MARK, start: index + 1, end: index + 2 });
            } else {
                if (this.unparsed.join("") === "main") {
                    this.unparsed = [];
                    this.parsed.push({ token: Tokens.T_MAIN, start: index + 1, end: index + 2 + Tokens.T_MAIN.length });
                } else if (this.unparsed.join("") === "compile") {
                    this.unparsed = [];
                    this.parsed.push({ token: Tokens.T_COMPILE, start: index + 1, end: index + 2 + Tokens.T_COMPILE.length });
                } else if (this.unparsed.join("") === "print") {
                    this.unparsed = [];
                    this.parsed.push({ token: Tokens.T_PRINT, start: index + 1, end: index + 2 + Tokens.T_PRINT.length });
                } else {
                    if (this.getActiveOpt("insideOfString")) {
                        this.stringBuffer.string += char;
                    /** } else if (this.getActiveOpt("insideOfBrackets")) {

                    } else if (this.getActiveOpt("insideOfParenthesis")) {

                    */ } else if (this.getActiveOpt("insideOfMacro")) {
                        if (readFileSync(this.file).toString().split("")[index + 1] === Tokens.T_RPAREN) {
                            this.parsed.push({ token: this.macroBuffer.string, start: index + 1, end: index + 2 + this.macroBuffer.string.length });
                            this.removeOpt("insideOfMacro");
                            this.macroBuffer = {
                                string: "",
                                start: 0,
                                end: 0
                            }
                        }
                    } else if (this.unparsed.join("") === "main") {
                        this.parsed.push({ token: Tokens.T_MAIN, start: index + 1, end: index + 2 + Tokens.T_MAIN.length });
                    } else if (this.unparsed.join("") === "compile") {
                        this.parsed.push({ token: Tokens.T_COMPILE, start: index + 1, end: index + 2 + Tokens.T_COMPILE.length });
                    } else {
                        this.unparsed.push(char);
                    }
                }
            }
        });

        console.log(this.generateAST(this.parsed));
    }
}