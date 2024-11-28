export function ToInt(input: string | number): number {
    switch (typeof input) {
        case 'string':
            const value = parseInt(input);
            return isNaN(value) ? null : value;
            break;
        case 'number':
            return parseInt(input.toFixed());
        default:
            throw new Error(
                `Unable to process 'ToInt' because the input is not supported`,
            );
    }
}
