import * as fs from 'node:fs';
import * as path from 'node:path';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';

import { AbstractParser } from '../abstracts';

import { ParserOptions, ParserBufferOptions } from '../interfaces';

export class JSONParser extends AbstractParser {
    constructor(options?: ParserOptions | ParserBufferOptions) {
        super(options);
    }

    public override start() {
        if (
            'input' in this.options &&
            fs.existsSync(path.resolve(this.options.input))
        ) {
            const readStream = fs.createReadStream(
                path.resolve(this.options.input),
            );
            const jsonStream = readStream.pipe(parser()).pipe(streamArray());
            jsonStream.on('data', ({ value }) =>
                this.processData.call(this, value),
            );
            jsonStream.on('end', this.finalize.bind(this));
            jsonStream.on('error', error => this.error.bind(this, error));
        }
    }
}
