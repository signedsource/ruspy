import _ from 'lodash';
import { Tokens } from "../enums/tokens";
import { Types } from "../enums/types";
import AbstractSyntaxTree from "../objects/ast";

export default class ASTHelper {
    ast: AbstractSyntaxTree;

    constructor() {
        this.ast = {
            // @ts-ignore
            body: {
                declarations: Array<object>()
            },
        };
    }

    getInstance(): AbstractSyntaxTree {
        return this.ast;
    }

    setMainMacro(name: Tokens.T_MAIN, type: Types.TP_MACRO, start: number, end: number) {
        this.ast.body.main = {
            type: {
                name, type, start, end
            }
        };
    }

    setCompileMacro(name: Tokens.T_COMPILE, type: Types.TP_MACRO, start: number, end: number) {
        this.ast.body.compile = {
            type: {
                name, type, start, end
            }
        }
    }

    addDeclaration(name: Tokens | string, type: Types, start: number, end: number) {
        this.ast.body.declarations.push({
            name, type, start, end
        });
    }
}