import { AbstractContract } from '@cmmv/core';
import { AbstractParserSchema } from '../abstracts';

export interface ParserOptions {
    contract: new () => AbstractContract;
    schema: new () => AbstractParserSchema;
    input: string;
}
