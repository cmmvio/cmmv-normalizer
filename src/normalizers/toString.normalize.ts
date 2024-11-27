export function ToString(input: string | number | object) {
    switch (typeof input) {
        case 'string':
            return input;
        case 'number':
            return input.toString();
        case 'object':
            return JSON.stringify(input);
    }
}
