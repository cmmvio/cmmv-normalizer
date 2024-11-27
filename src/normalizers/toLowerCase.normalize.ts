export function ToLowerCase(input: string | number) {
    switch (typeof input) {
        case 'string':
            return input.toLowerCase();
        case 'number':
            return input.toString().toLowerCase();
    }
}
