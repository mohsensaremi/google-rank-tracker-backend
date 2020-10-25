export const isObjectId = <T>(arg: T) => (/^[0-9a-fA-F]{24}$/).test(String(arg));
