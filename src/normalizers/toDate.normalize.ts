export function ToDate(input: string) {
    try {
        return new Date(input);
    } catch (err) {
        throw new Error(
            `Unable to process 'ToDate' because the input is not supported`,
        );
    }
}
