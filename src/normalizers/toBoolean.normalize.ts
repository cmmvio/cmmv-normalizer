export function ToBoolean(input: string | number | boolean): boolean {
    switch (typeof input) {
        case 'string':
            const lowerInput = input.trim().toLowerCase();
            if (lowerInput === 'true' || lowerInput === '1') return true;
            if (lowerInput === 'false' || lowerInput === '0') return false;
            throw new Error(
                `Unable to process 'ToBoolean' because the string "${input}" is not a valid boolean value.`,
            );

        case 'number':
            if (input === 1) return true;
            if (input === 0) return false;
            throw new Error(
                `Unable to process 'ToBoolean' because the number "${input}" is not a valid boolean value.`,
            );

        case 'boolean':
            return input;

        default:
            throw new Error(
                `Unable to process 'ToBoolean' because the input type "${typeof input}" is not supported.`,
            );
    }
}
