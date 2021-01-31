export const generateId = (start?: string) => {
    let last = BigInt(start ? String(parseInt(start, 36)) : '0');

    return () => {
        const newId = last + 1n;
        last = newId;
        return newId.toString(36);
    };
};
