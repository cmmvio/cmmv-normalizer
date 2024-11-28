<p align="center">
  <a href="https://cmmv.io/" target="blank"><img src="https://raw.githubusercontent.com/andrehrferreira/docs.cmmv.io/main/public/assets/logo_CMMV2_icon.png" width="300" alt="CMMV Logo" /></a>
</p>
<p align="center">Contract-Model-Model-View (CMMV) <br/> Building scalable and modular applications using contracts.</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@cmmv/normalizer"><img src="https://img.shields.io/npm/v/@cmmv/normalizer.svg" alt="NPM Version" /></a>
    <a href="https://github.com/andrehrferreira/cmmv-server/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@cmmv/core.svg" alt="Package License" /></a>
</p>

<p align="center">
  <a href="https://cmmv.io">Documentation</a> &bull;
  <a href="https://github.com/andrehrferreira/cmmv-normalizer/issues">Report Issue</a>
</p>

## Description

The `@cmmv/normalizer` module provides tools for parsing, transforming, and normalizing data from large files in various formats, such as **JSON**, **XML**, and **YAML**. Built for **performance** and **scalability**, it uses **stream-based parsing** to handle large datasets with minimal memory usage. The module integrates seamlessly with CMMV models and contracts, ensuring data consistency and validation.

Additionally, `@cmmv/normalizer` includes **tokenization** capabilities for handling sensitive data, leveraging `@cmmv/encryptor` for AES256 encryption and elliptic curve key generation.

## Features

- **Stream-Based Parsing:** Efficiently processes large files with low memory consumption.
- **Multi-Format Support:** JSON, XML, YAML, and customizable parsers.
- **Data Normalization:** Transform and validate data using configurable schemas.
- **Integration:** Works seamlessly with CMMV contracts and models.
- **Tokenization:** Secure sensitive data with AES256 and elliptic curves.
- **Customizable Pipelines:** Create custom transformers and validations.

## Installation

Install the `@cmmv/normalizer` package via npm:

```bash
$ pnpm add @cmmv/normalizer
```

## Quick Start

Below is an example of parsing and normalizing a JSON file with a custom schema:

```typescript
import { JSONParser, AbstractParserSchema, ToLowerCase, Tokenizer, ToDate, ToObjectId } from '@cmmv/normalizer';
import { ECKeys } from '@cmmv/encryptor';

const keys = ECKeys.generateKeys();

const tokenizer = Tokenizer({
    publicKey: ECKeys.getPublicKey(keys),
});

class CustomerSchema extends AbstractParserSchema {
    public field = {
        id: {
            to: 'id',
            transform: [ToObjectId],
        },
        name: { to: 'name' },
        email: {
            to: 'email',
            validation: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            transform: [ToLowerCase],
        },
        phoneNumber: {
            to: 'phone',
            transform: [tokenizer],
        },
        registrationDate: {
            to: 'createdAt',
            transform: [ToDate],
        },
    };
}

new JSONParser({
    input: './sample/large-customers.json',
    schema: CustomerSchema,
})
.pipe(data => console.log('Processed Data:', data))
.once('end', () => console.log('Parsing Complete'))
.once('error', error => console.error('Parsing Error:', error))
.start();
```

## Supported File Formats

The ``@cmmv/normalizer`` module includes built-in parsers for the following formats:

| Format | Parser      | Example File      |
|--------|-------------|-------------------|
| JSON   | JSONParser  | large-data.json   |
| XML    | XMLParser   | large-data.xml    |
| YAML   | YAMLParser  | large-data.yaml   |

For custom formats, you can create your own parser by extending the ``AbstractParser``.

## API Reference

### AbstractParser

All parsers extend the AbstractParser class, providing a consistent interface for processing data:

| Method            | Description                                                                               |
|--------------------|-------------------------------------------------------------------------------------------|
| `pipe(fn: Function)` | Adds a function to the processing pipeline for transforming or handling parsed data.      |
| `start()`          | Starts the parser and begins processing the input file.                                   |
| `processData(data: any)` | Processes individual data items through the schema and transformation pipeline.         |
| `finalize()`       | Finalizes the parsing operation and emits an end event.                                   |
| `error(err: Error)` | Emits an error event for handling parsing errors.                                          |

### Built-in Normalizers

The module provides several built-in normalizers for transforming data fields:

| Normalizer    | Description                                             |
|---------------|---------------------------------------------------------|
| `ToBoolean`   | Converts a value to a boolean.                          |
| `ToDate`      | Converts a value to a JavaScript Date object.           |
| `ToFixed`     | Formats a number to a fixed number of decimal places.   |
| `ToFloat`     | Converts a value to a floating-point number.            |
| `ToInt`       | Converts a value to an integer.                         |
| `Tokenizer`   | Encrypts sensitive data with AES256 and elliptic curves.|
| `ToLowerCase` | Converts a string to lowercase.                         |
| `ToObjectId`  | Converts a value to a MongoDB ObjectId.                 |
| `ToString`    | Converts a value to a string.                           |
| `ToUpperCase` | Converts a string to uppercase.                         |

## Custom Parser

You can create a custom parser by extending ``AbstractParser``. Here’s an example for a CSV parser:

```typescript
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';
import { AbstractParser, ParserOptions } from '@cmmv/normalizer';

export class CSVParser extends AbstractParser {
    constructor(options?: ParserOptions) {
        super();
        this.options = options;
    }

    public override start() {
        const inputPath = path.resolve(this.options.input);

        if (fs.existsSync(inputPath)) {
            const readStream = fs.createReadStream(inputPath);

            const rl = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity, // Handle all newlines (Windows, Unix)
            });

            let headers: string[] | null = null;

            rl.on('line', (line) => {
                if (!headers) {
                    // First line contains headers
                    headers = line.split(',');
                    return;
                }

                // Map CSV columns to header fields
                const values = line.split(',');
                const record = headers.reduce((acc, header, index) => {
                    acc[header.trim()] = values[index]?.trim();
                    return acc;
                }, {});

                // Process each record
                this.processData.call(this, record);
            });

            rl.on('close', this.finalize.bind(this));
            rl.on('error', (error) => this.error.bind(this, error));
        } else {
            console.error(`File not found: ${inputPath}`);
        }
    }
}
```

The @cmmv/normalizer module provides a powerful and extensible framework for parsing and normalizing large datasets in various formats. Its tight integration with CMMV contracts and models ensures consistency and scalability, making it an essential tool for building robust Node.js applications.