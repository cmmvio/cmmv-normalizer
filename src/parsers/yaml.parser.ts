import * as fs from 'node:fs';
import * as path from 'node:path';
import { parse } from 'yaml';

import { AbstractParser } from '../abstracts';
import { ParserOptions } from '../interfaces';

export class YAMLParser extends AbstractParser {
    private buffer: string;

    constructor(options?: ParserOptions) {
        super();
        this.options = options;
        this.buffer = '';
    }

    public override start() {
        const filePath = path.resolve(this.options.input);

        if (fs.existsSync(filePath)) {
            const readStream = fs.createReadStream(filePath, {
                encoding: 'utf-8',
                highWaterMark: 1024 * 64, // 64KB buffer
            });

            readStream.on('data', chunk => {
                this.buffer += chunk;

                let boundary = this.buffer.lastIndexOf('\n---'); // YAML document delimiter
                if (boundary === -1) return;

                const processChunk = this.buffer.slice(0, boundary);
                this.buffer = this.buffer.slice(boundary + 4); // Keep remaining part after delimiter

                try {
                    const documents = parse(processChunk); // Parse the YAML documents
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
        } else {
            this.error(new Error(`File not found: ${filePath}`));
        }
    }
}
