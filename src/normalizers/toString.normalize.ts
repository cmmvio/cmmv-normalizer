export function ToString(input: string | number | object) {
    switch (typeof input) {
        case 'string':
            return input;
        case 'number':
            return input.toString();
        case 'object':
            return JSON.stringify(input);
        default:
            throw new Error(
                `Unable to process 'ToString' because the input is not supported`,
            );
    }
}
