import { readFileSync } from "fs";
import { Tokens } from "../enums/tokens";
import { Types } from "../enums/types";
import ASTHelper from "../helpers/ASTHelper";
import AbstractSyntaxTree from "../objects/ast";

export default class Lexer {
	file: string;
	parsed: Array<{ token: Tokens | string, start: number, end: number }>;
	unparsed: string;
	ast: ASTHelper;
	opts: { [key: string]: any };
	stringBuffer: { string: string, start: number, end: number };
	macroBuffer: { string: string, start: number, end: number };

	constructor(file: string) {
		this.file = file;
		this.parsed = [];
		this.unparsed = "";

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
				children: { start: 0, end: 0 }
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
				active: {
					macro: false,
					name: false,
					args: false
				},
				children: { start: 0, end: 0 }
			},
			insideOfComment: {
				active: false,
				children: { start: 0, end: 0 }
			}
		};

		this.ast = new ASTHelper();
	}

	private generateAST(parsedTokens: Array<{ token: Tokens | string, start: number, end: number }>): AbstractSyntaxTree {
		parsedTokens.forEach(component => {
			if (component.token === Tokens.T_PRINT) {
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
			this.unparsed += char;
			// console.log(`Current char: ${char}\nCurrent unparsed: ${this.unparsed}\nCurrent parsed: ${this.parsed.map(component => component.token).join("")}\nCurrent opts: ${JSON.stringify(this.opts)}`);
			console.log(char, index, this.unparsed);


			switch (char) {
				case "-":
					if (!this.getActiveOpt("insideOfComment")) {
						this.registerOpt("insideOfComment", index, index + 1);
					}

					break;
				case "\n" || "\r" || "\t":
					if (this.getActiveOpt("insideOfComment")) {
						this.removeOpt("insideOfComment");
					} else if (this.getActiveOpt("insideOfString")) {
						this.unparsed = this.unparsed.slice(0, -1);
						this.stringBuffer.string += char;
						this.stringBuffer.start == 0 ? this.stringBuffer.start = index : this.stringBuffer.start;
						this.stringBuffer.end = index;
					}

					break;
				/** case "print":
					if (!this.getActiveOpt("insideOfComment")) {
						if (this.getActiveOpt("insideOfString")) {

						} else {
							if (this.getActiveOpt("insideOfMacro")) {
								throw new Error("Cannot use a reserved word inside of a macro")
							}
						}
					}
					
					break; */
				case "#":
					if (!this.getActiveOpt("insideOfComment")) {
						if (this.getActiveOpt("insideOfString")) {
							this.unparsed = this.unparsed.slice(0, -1);
							this.stringBuffer.string += char;
							this.stringBuffer.start == 0 ? this.stringBuffer.start = index : this.stringBuffer.start;
							this.stringBuffer.end = index + 1;
						} else {
							this.opts.insideOfMacro.active.macro = true;
						}
					}

					break;
				case "[":
					if (!this.getActiveOpt("insideOfComment")) {
						if (this.getActiveOpt("insideOfString")) {
							this.unparsed = this.unparsed.slice(0, -1);
							this.stringBuffer.string += char;
							this.stringBuffer.start == 0 ? this.stringBuffer.start = index : this.stringBuffer.start;
							this.stringBuffer.end = index + 1;
						} else {
							if (this.opts.insideOfMacro.active.macro) this.opts.insideOfMacro.active.name = true;
							else this.registerOpt("insideOfBrackets", index, index + 1);

							this.parsed.push({ token: Tokens.T_LBRACKET, start: index, end: index + 1 });
						}
					}

					break;
				case "(":
					if (!this.getActiveOpt("insideOfComment")) {
						if (this.getActiveOpt("insideOfString")) {
							this.unparsed = this.unparsed.slice(0, -1);
							this.stringBuffer.string += char;
							this.stringBuffer.start == 0 ? this.stringBuffer.start = index : this.stringBuffer.start;
							this.stringBuffer.end = index + 1;
						} else {
							if (this.opts.insideOfMacro.active.macro) this.opts.insideOfMacro.active.args = true;
							else this.registerOpt("insideOfParenthesis", index, index + 1);

							this.parsed.push({ token: Tokens.T_LPAREN, start: index, end: index + 1 });
						}
					}

					break;
				case ")":
					if (!this.getActiveOpt("insideOfComment")) {
						if (this.getActiveOpt("insideOfString")) {
							this.unparsed = this.unparsed.slice(0, -1);
							this.stringBuffer.string += char;
							this.stringBuffer.start == 0 ? this.stringBuffer.start = index : this.stringBuffer.start;
							this.stringBuffer.end = index + 1;
						} else {
							if (this.opts.insideOfMacro.active.macro) {
								if (this.opts.insideOfMacro.active.name) {
									if (this.opts.insideOfMacro.active.args) {
										this.parsed.push({ token: this.macroBuffer.string, start: this.macroBuffer.start, end: this.macroBuffer.end });
									} else {
										throw new Error("Macros must have arguments provided")
									}
								} else {
									throw new Error("The specified macro hasn't been given a name reference");
								}
							} else {
								this.removeOpt("insideOfParenthesis");
							}

							this.parsed.push({ token: Tokens.T_RPAREN, start: index, end: index + 1 });
						}
					}

					break;
				case "]":
					if (!this.getActiveOpt("insideOfComment")) {
						if (this.getActiveOpt("insideOfString")) {
							this.unparsed = this.unparsed.slice(0, -1);
							this.stringBuffer.string += char;
							this.stringBuffer.start == 0 ? this.stringBuffer.start = index : this.stringBuffer.start;
							this.stringBuffer.end = index + 1;
						} else {
							if (this.opts.insideOfMacro.active.macro) {
								if (this.opts.insideOfMacro.active.name) {
									if (this.opts.insideOfMacro.active.args) {
										this.opts.insideOfMacro.active.name = false;
										this.opts.insideOfMacro.active.macro = false;
										this.opts.insideOfMacro.active.arguments = false;
										this.parsed.push({ token: Tokens.T_RBRACKET, start: index, end: index + 1 });
									} else {
										throw new Error("Macros must have arguments provided")
									}
									
								} else {
									throw new Error("The specified macro hasn't been given a name reference");
								}
							}
						}
					}

					break;
				case '"':
					if (!this.getActiveOpt("insideOfComment")) {
						if (this.getActiveOpt("insideOfString")) {
							if (this.opts.insideOfString.children.start != 0) {
								throw new Error("Cannot have nested strings");
							}
						} else {
							if (this.opts.insideOfString.children.start == 0) {

							}
						}
					}

					break;
				default:
					if (!this.getActiveOpt("insideOfComment")) {
						if (this.getActiveOpt("insideOfString")) {
							this.unparsed = this.unparsed.slice(0, -1);
							this.stringBuffer.string += char;
							this.stringBuffer.start == 0 ? this.stringBuffer.start = index : this.stringBuffer.start;
							this.stringBuffer.end = index + 1;
						} else if (this.opts.insideOfMacro.active.macro) {
							/** if (this.unparsed === "main") {
								this.parsed.push({ token: this.unparsed, start: index - this.unparsed.length + 1, end: index + 1 });
								this.unparsed = this.unparsed.slice(0, -1);
							} else if (this.unparsed === "compile") {
								this.parsed.push({ token: this.unparsed, start: index - this.unparsed.length + 1, end: index + 1 });
								this.unparsed = this.unparsed.slice(0, -1);
							} */

							this.parsed.push({ token: this.unparsed, start: index - this.unparsed.length + 1, end: index + 1 });
							this.unparsed = "";
						} else {
							if (char === " ") {
								if (!this.getActiveOpt("insideOfString")) this.unparsed = this.unparsed.slice(0, -1);
							}
						}
					}
			}
		});

		console.log(this.generateAST(this.parsed).body.declarations);
	}
}