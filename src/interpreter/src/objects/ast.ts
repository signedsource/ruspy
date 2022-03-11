import { Tokens } from "../enums/tokens";
import { Types } from "../enums/types";

export default interface AbstractSyntaxTree extends Object {
    [key: string]: any;
    body: {
        main: {
            type: {
                name: Tokens,
                type: Types,
                start: number,
                end: number
            }
        },
        compile?: {
            type: {
                name: Tokens,
                type: Types
                start: number,
                end: number
            }
        },
        declarations: Array<object>
    }
}