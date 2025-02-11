import * as fs from 'node:fs';
import * as path from 'node:path';
import { parse } from 'yaml';

import { AbstractParser } from '../abstracts';

import { ParserOptions, ParserBufferOptions } from '../interfaces';

export class YAMLParser extends AbstractParser {
    private buffer: string;

    constructor(options?: ParserOptions | ParserBufferOptions) {
        super(options);
        this.buffer = '';
    }

    public override start() {
        if (
            'input' in this.options &&
            fs.existsSync(path.resolve(this.options.input))
        ) {
            const readStream = fs.createReadStream(
                path.resolve(this.options.input),
                {
                    encoding: 'utf-8',
                    highWaterMark: 1024 * 64, // 64KB buffer
                },
            );

            readStream.on('data', chunk => {
                this.buffer += chunk;

                let boundary = this.buffer.lastIndexOf('\n---');
                if (boundary === -1) return;

                const processChunk = this.buffer.slice(0, boundary);
                this.buffer = this.buffer.slice(boundary + 4);

                try {
                    const documents = parse(processChunk);
                    documents.forEach(doc => this.processData(doc));
                } catch (error) {
                    this.error(error);
                }
            });

            readStream.on('end', () => {
                if (this.buffer.trim()) {
                    try {
                        const documents = parse(this.buffer);
                        documents.forEach(doc => this.processData(doc));
                    } catch (error) {
                        this.error(error);
                    }
                }

                this.finalize.call(this);
            });

            readStream.on('error', error => this.error.call(this, error));
        }
    }
}
