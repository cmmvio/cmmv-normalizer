export function ToUpperCase(input: string | number): string {
    switch (typeof input) {
        case 'string':
            return input.toUpperCase();
        case 'number':
            return input.toString().toUpperCase();
        default:
            throw new Error(
                `Unable to process 'ToUpperCase' because the input is not supported`,
            );
    }
}
