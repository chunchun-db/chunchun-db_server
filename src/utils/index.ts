export const generateId = (start?: string) => {
    let last = BigInt(start ?? '0');

    return () => {
        const newId = last + 1n;
        last = newId;
        return newId.toString(36);
    };
};
