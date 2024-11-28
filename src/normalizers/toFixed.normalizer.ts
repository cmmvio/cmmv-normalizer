export function ToFixed(input: number): string {
    if (typeof input === 'number') return input.toFixed();
    else
        throw new Error(
            `Unable to process 'ToFixed' because the input is not supported`,
        );
}
