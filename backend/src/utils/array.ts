export const spreadArrayBy = (k: string) => <U, V>(keys: readonly (U | null | undefined)[], items: V[], defaultValue = null) => {
    return keys
        .filter((key): key is U => !!key)
        .map(key => items.find(item =>
            String((item as any)[k]) === String(key)
        ) || defaultValue);
};

export const spreadArrayById = spreadArrayBy('id');