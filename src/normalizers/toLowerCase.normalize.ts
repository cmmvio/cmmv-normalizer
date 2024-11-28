export function ToLowerCase(input: string | number): string {
    switch (typeof input) {
        case 'string':
            return input.toLowerCase();
        case 'number':
            return input.toString().toLowerCase();
        default:
            throw new Error(
                `Unable to process 'ToLowerCase' because the input is not supported`,
            );
    }
}
