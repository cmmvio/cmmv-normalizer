export abstract class AbstractParserSchema {
    public abstract field: Record<
        string,
        {
            to: string;
            validation?: RegExp;
            transform?: Array<(value: any) => any>;
        }
    >;
}
