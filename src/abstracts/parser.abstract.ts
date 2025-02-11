import { EventEmitter } from 'node:events';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ObjectId } from 'mongodb';

import {
    ParserOptions,
    XMLParserOptions,
    ParserBufferOptions,
} from '../interfaces';

import { AbstractParserSchema } from './parserSchema.abstract';

export abstract class AbstractParser extends EventEmitter {
    protected options: ParserOptions | XMLParserOptions | ParserBufferOptions;
    protected pipes: Array<(data: any) => any | Promise<any>> = [];
    protected schema: AbstractParserSchema;

    constructor(
        options?: ParserOptions | XMLParserOptions | ParserBufferOptions,
    ) {
        super();
        this.options = options;
        this.schema = new this.options.schema();
    }

    /**
     * Adds a function or promise to the pipeline.
     *
     * @param fn A function or promise to process data.
     * @returns The current instance for chaining.
     */
    public pipe(fn: (data: any) => any | Promise<any>): AbstractParser {
        this.pipes.push(fn);
        return this;
    }

    /**
     * Parses and transforms raw data based on the provided schema.
     *
     * @param rawData The raw data object to parse and transform.
     * @returns The transformed object or null if validation fails.
     */
    public async parser(rawData: any): Promise<any> {
        if (!this.schema) throw new Error('Schema is required to parse data.');

        const result: Record<string, any> = {};

        for (const key in rawData) rawData[key.toLowerCase()] = rawData[key];

        for (const [fieldName, fieldOptions] of Object.entries(
            this.schema.field,
        )) {
            const { to, validation, transform } = fieldOptions;

            let value = rawData[fieldName.toLowerCase()];

            if (value !== undefined && value !== null) {
                if (transform && Array.isArray(transform)) {
                    for (const transformer of transform)
                        value = transformer(value);
                }

                if (validation && !validation.test(value)) {
                    console.warn(
                        `Validation failed for field "${fieldName}" with value "${value}".`,
                    );
                    return null;
                }
            } else {
                value = null;
            }

            if (to) result[to] = value;
            else result[fieldName] = value;
        }

        if ('model' in this.options && this.options.model) {
            let newObject: any = plainToClass(this.options.model, result, {
                excludeExtraneousValues: true,
                exposeUnsetFields: false,
                enableImplicitConversion: true,
            });

            newObject = this.removeUndefinedWithConstructor(
                newObject,
                this.options.model,
            );

            for (const key in result) {
                if (result[key] instanceof ObjectId)
                    newObject[key] = result[key];
            }

            const errors = await validate(newObject, {
                forbidUnknownValues: false,
                skipMissingProperties: true,
                stopAtFirstError: true,
            });

            if (errors.length > 0) throw new Error(errors[0].toString());

            return newObject;
        }

        return result;
    }

    /**
     * Removes undefined values from an object.
     *
     * @param obj The object to clean up.
     * @returns A new object with undefined values removed.
     */
    private removeUndefinedWithConstructor<T>(
        obj: T,
        Constructor: new (partial: Partial<T>) => T,
    ): T {
        const cleanObj = Object.keys(obj).reduce((acc, key) => {
            const value = obj[key as keyof T];
            if (value !== undefined) {
                (acc as any)[key] = value;
            }
            return acc;
        }, {} as Partial<T>);

        return new Constructor(cleanObj);
    }

    /**
     * Processes data through all pipes sequentially.
     *
     * @param data The initial data to be processed.
     * @returns The final processed result after all pipes.
     */
    public async processData(data: any): Promise<any> {
        let result = await this.parser(data);

        for (const pipe of this.pipes) {
            if (typeof pipe === 'function') result = await pipe(result);
            else throw new Error('Pipe is not a function.');
        }

        return result;
    }

    /**
     * Finalizes the process and emits the 'end' event.
     */
    public finalize(): void {
        this.emit('end');
    }

    public error(error: any): void {
        this.emit('erro', error);
    }

    /**
     * Abstract method to be implemented by subclasses.
     */
    public start() {
        throw new Error("Method 'start()' must be implemented.");
    }
}
