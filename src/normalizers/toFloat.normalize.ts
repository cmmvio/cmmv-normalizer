export function ToFloat(input: string | number): number {
    switch (typeof input) {
        case 'string':
            const value = parseFloat(input);
            return isNaN(value) ? null : value;
            break;
        case 'number':
            return input;
        default:
            throw new Error(
                `Unable to process 'ToFloat' because the input is not supported`,
            );
    }
}
