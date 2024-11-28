import * as fs from 'node:fs';
import * as path from 'node:path';
import { createReadStream } from 'node:fs';
import { SAXParser } from 'sax';
import { AbstractParser } from '../abstracts';
import { XMLParserOptions } from '../interfaces';

export class XMLParser extends AbstractParser {
    declare protected options: XMLParserOptions;

    constructor(options?: XMLParserOptions) {
        super();
        this.options = options;
    }

    public override start() {
        if (fs.existsSync(path.resolve(this.options.input))) {
            const fileStream = createReadStream(
                path.resolve(this.options.input),
            );
            const saxParser = new SAXParser(this.options.strict);

            let currentElement: string | null = null;
            let record: Record<string, any> = {};

            saxParser.onopentag = node => {
                currentElement = node.name;
            };

            saxParser.ontext = text => {
                if (
                    currentElement &&
                    currentElement.toLowerCase() !==
                        this.options.nodeName.toLowerCase()
                ) {
                    record[currentElement.toLowerCase()] = text.trim();
                }
            };

            saxParser.onclosetag = nodeName => {
                if (
                    nodeName.toLowerCase() ===
                    this.options.nodeName.toLowerCase()
                ) {
                    this.processData.call(this, record);
                    record = {};
                }

                currentElement = null;
            };

            saxParser.onend = () => {
                this.finalize.call(this);
            };

            // Handle errors
            saxParser.onerror = err => {
                this.error.call(this, err);
                saxParser.resume();
            };

            // @ts-ignore
            fileStream.on('data', chunk => saxParser.write(chunk));
            fileStream.on('end', () => saxParser.end());
        } else {
            console.error('Input file does not exist!');
        }
    }
}
